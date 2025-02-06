import transactionModels from "../models";

const TransactionDB = {
    create: async (data: TransactionDataObject) => {
        const newData = new transactionModels.Transaction(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("TransactionDB Database Error");
        }
        return saveData;
    },
    findOne: async ({ filter }: { filter: any }) => {
        return transactionModels.Transaction.findOne(filter);
    },
    find: async ({ filter }: { filter: any }) => {
        return transactionModels.Transaction.find(filter).sort({ created: -1 });
    },
    update: async ({ filter, update }: { filter: any, update: any }) => {
        return transactionModels.Transaction.findOneAndUpdate(
            filter,
            update
        );
    },
    remove: async ({ filter }: { filter: any }) => {
        const res: any = await transactionModels.Transaction.deleteOne(filter);
        return {
            found: res.n,
            deleted: res.deletedCount
        };
    }
}

const transactionDatas = {
    TransactionDB
}
export default transactionDatas;