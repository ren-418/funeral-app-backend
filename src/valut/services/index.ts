import vaultDatas from "../data-access"
import authDatas from "../../auth/data-access"

export const checkavailabilityOfVault = async (userId: string) => {
    const user = await authDatas.AuthDB.findOne({ filter: { userId: userId } });
    if (user.isFullAccess) {
        return true;
    }
    const exsitingVaults = await vaultDatas.vaultDB.find({ filter: { userId: userId } });

    if (exsitingVaults.length < 3) {
        return true;
    }
    return false;
}