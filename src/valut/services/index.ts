import vaultDatas from "../data-access"
import authDatas from "../../auth/data-access"

export const checkavailabilityOfVault = async (userId: string) => {
    const user = await authDatas.AuthDB.findOne({ filter: { userId: userId } });
    if (user.isFullAccess) {
        return true;
    }
    console.log("user.isFullAccess :::", user.isFullAccess)
    const exsitingVaults = await vaultDatas.vaultDB.find({ filter: { userId: userId } });

    console.log("exsitingVaults.length :::", exsitingVaults.length)
    if (exsitingVaults.length < 3) {
        return true;
    }
    return false;
}