import vaultDatas from "../data-access"
import authDatas from "../../auth/data-access"

export const checkavailabilityOfVault = async (userId: string) => {
    const user = await authDatas.AuthDB.findOne({ filter: { email: userId } });
    const exsitingVaults = await vaultDatas.vaultDB.find({ filter: { userId: userId } });
    if (user.isFullAccess && !!user.subscription) {
        return true;
    }
    if(user.isFullAccess && !user.subscription) {
        if (exsitingVaults.length<5) {
            return true
        }
        return false
    }
    

    if (exsitingVaults.length < 3) {
        return true;
    }
    return false;
}