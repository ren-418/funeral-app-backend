
import { Response, Request, NextFunction } from "express";
import { Now } from "../../utils";
import setlog from "../../utils/setlog";
import config from "../../../config.json";

import checkListDatas from "../data-access";
import { v4 as uuidv4 } from 'uuid';

const checkListController = {

    newCheckList: async (req: Request, res: Response) => {
        try {
            const { userId, title, desc } = req.body;
            const id = uuidv4();
            await checkListDatas.checkListDB.create({
                id: id,
                userId: userId,
                title: title,
                desc: desc,
                completed: false,
                created: Date.now()
            });
            return res.status(200).json({ message: "success" });

        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }

    },
    getOneItem: async (req: Request, res: Response) => {
        try {
            const { id, userId } = req.body;
            const foundItem = await checkListDatas.checkListDB.findOne({ filter: { id: id, userId: userId } });
            if (!!foundItem) {
                return res.status(200).json({ message: "success", data: foundItem });
            } else {
                return res.status(404).json({ message: "Found failed" });
            }
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
    getWholeItemsByUser: async (req: Request, res: Response) => {
        try {
            const { userId } = req.body;
            const foundItems = await checkListDatas.checkListDB.find({ filter: { userId: userId } });
            if (!!foundItems) {
                return res.status(200).json({ message: "success", data: foundItems });
            } else {
                return res.status(404).json({ message: "Found failed" });
            }
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
    updateItem: async (req: Request, res: Response) => {
        try {
            const { id, userId, title, desc, completed } = req.body;
            const updatedItem = await checkListDatas.checkListDB.update({ filter: { id: id, userId: userId }, update: { title: title, desc: desc, completed: completed } });
            if (!!updatedItem) {
                return res.status(200).json({ message: "success", data: updatedItem });
            } else {
                return res.status(404).json({ message: "Update failed" });
            }
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
    deleteItem: async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedItem = await checkListDatas.checkListDB.remove({ filter: { id: id } });
            if (!!deletedItem) {
                return res.status(200).json({ message: "success", data: deletedItem });
            } else {
                return res.status(404).json({ message: "delete failed" });
            }
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
}

export default checkListController