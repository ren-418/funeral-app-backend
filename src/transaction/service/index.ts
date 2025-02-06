import cron from 'node-cron'

import authDatas from "../../auth/data-access"
import transactionDatas from "../data-access";
import setlog from "../../utils/setlog";

const unlockFullAccess = async (userId: string) => {
    try {
        await authDatas.AuthDB.update({ filter: { userId: userId }, update: { isFullAccess: true } });
        return true;
    } catch (err: any) {
        setlog("MongoDB Error", err);
        return false;
    }
}

const updateIsFullAccessJob = () => {
    try {
        console.log(" updateIsFullAccessJob called :::")
        cron.schedule('* * * * *', async () => {
            try {
                console.log(" cron.schedule called :::")
                const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
                const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
                const oneDayago = new Date(Date.now() - (1 * 24 * 60 * 60 * 1000));

                console.log("oneMinutesAgo :::", oneDayago)
                const transactionsToUpdate = await transactionDatas.TransactionDB.find({
                    filter: {
                        created: { $lt: oneYearAgo }
                    }
                });

                const usersToUpdate = await authDatas.AuthDB.find({
                    filter: {
                        isFullAccess: true,
                        created: { $lt: oneDayago }
                    }
                })

                for (const transaction of transactionsToUpdate) {
                    const userId = transaction.userId;
                    await authDatas.AuthDB.update({ filter: { userId: userId }, update: { isFullAccess: false } })
                }

                for (const user of usersToUpdate) {
                    const userId = user.email;
                    await authDatas.AuthDB.update({ filter: { email: userId }, update: { isFullAccess: false } })
                }
            } catch (err) {
                setlog("callback", err)
            }

        }, {
            scheduled: true,
            timezone: "UTC"
        });
    } catch (err) {
        setlog("CronError", err)
    }

};

const transactionService = {
    unlockFullAccess,
    updateIsFullAccessJob
}

export default transactionService