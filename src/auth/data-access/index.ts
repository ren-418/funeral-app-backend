import AuthModels from "../models";

const AuthDB = {
    create: async (data: AuthDataObject) => {
        const newData = new AuthModels.Auth(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("AuthDB Database Error");
        }
        return saveData;
    },
    findOne: async ({ filter }: { filter: any }) => {
        return AuthModels.Auth.findOne(filter);
    },
    find: async ({ filter }: { filter: any }) => {
        return AuthModels.Auth.find(filter);
    },
    update: async ({ filter, update }: { filter: any, update: any }) => {
        return AuthModels.Auth.findOneAndUpdate(
            filter,
            update
        );
    },
    remove: async ({ filter }: { filter: any }) => {
        const res: any = await AuthModels.Auth.deleteOne(filter);
        return {
            found: res.n,
            deleted: res.deletedCount
        };
    }
}

const authDatas = {
    AuthDB
}
export default authDatas;