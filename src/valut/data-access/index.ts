import vaultModels from "../models";

const vaultDB = {
    create: async (data: VaultDataObject) => {
        const newData = new vaultModels.vault(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("vaultDB Database Error");
        }
        return saveData;
    },
    findOne: async ({ filter }: { filter: any }) => {
        return vaultModels.vault.findOne(filter);
    },
    find: async ({ filter }: { filter: any }) => {
        return vaultModels.vault.find(filter).sort({ created: -1 });
    },
    update: async ({ filter, update }: { filter: any, update: any }) => {
        return vaultModels.vault.findOneAndUpdate(
            filter,
            update
        );
    },
    remove: async ({ filter }: { filter: any }) => {
        const res: any = await vaultModels.vault.deleteOne(filter);
        return {
            found: res.n,
            deleted: res.deletedCount
        };
    }
}

const vaultDatas = {
    vaultDB
}
export default vaultDatas;