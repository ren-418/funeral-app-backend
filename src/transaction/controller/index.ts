import { Response, Request, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';

import { Now } from "../../utils";
import setlog from "../../utils/setlog";

import transactionDatas from "../data-access";
import transactionService from "../service";

const transactionController = {

    newCheckList: async (req: Request, res: Response) => {
        try {
            const { userId, amount } = req.body;
            const id = uuidv4();
            await transactionDatas.TransactionDB.create({
                id: id,
                userId: userId,
                amount:amount,
                created:Date.now()
            });
            const result = await transactionService.unlockFullAccess(userId);
            if (!!result) {
                return res.status(200).json({ message: "success" });
            }
            return res.status(302).json({ message: "failed to unlock" });
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }

    },
    getOneItem: async (req: Request, res: Response) => {
        try {
            const { id, userId } = req.body;
            const foundItem = await transactionDatas.TransactionDB.findOne({ filter: { id: id, userId: userId } });
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
            const foundItemsByMyself = await transactionDatas.TransactionDB.find({ filter: { userId: userId } });
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
    updateItem: async (req: Request, res: Response) => {
        try {
            const { id, userId, title, desc, completed } = req.body;
            const result = await transactionDatas.TransactionDB.update({ filter: { id: id, userId: userId }, update: { title: title, desc: desc, completed: completed } });
            if (!!result) {
                return res.status(200).json({ message: "success"});
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
            const deletedItem = await transactionDatas.TransactionDB.remove({ filter: { id: id } });
            if (!!deletedItem) {
                return res.status(200).json({ message: "success", data: deletedItem });
            } else {
                return res.status(404).json({ message: "delete failed" });
            }
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    }
}

export default transactionController;