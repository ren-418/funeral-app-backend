import checkListModels from "../models";

const checkListDB = {
    create: async (data: CheckListDataObject) => {
        const newData = new checkListModels.CheckList(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("CheckListDB Database Error");
        }
        return saveData;
    },
    findOne: async ({ filter }: { filter: any }) => {
        return checkListModels.CheckList.findOne(filter);
    },
    find: async ({ filter }: { filter: any }) => {
        return checkListModels.CheckList.find(filter).sort({ created: -1 });
    },
    update: async ({ filter, update }: { filter: any, update: any }) => {
        return checkListModels.CheckList.findOneAndUpdate(
            filter,
            update
        );
    },
    remove: async ({ filter }: { filter: any }) => {
        const res: any = await checkListModels.CheckList.deleteOne(filter);
        return {
            found: res.n,
            deleted: res.deletedCount
        };
    }
}

const checkListDatas = {
    checkListDB
}
export default checkListDatas;