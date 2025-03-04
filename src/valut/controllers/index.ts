import { Response, Request, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer'

import { Now } from "../../utils";
import setlog from "../../utils/setlog";
import config from "../../../config.json";
import vaultDatas from "../data-access";
import { checkavailabilityOfVault } from "../services";
import { emitNotificationOfVault } from "../../socket";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jillianhereda@gmail.com',
        pass: 'qgji beki zrjm fzqn',
    },
});

const vaultController = {

    newVault: async (req: any, res: Response) => {
        try {
            const { title, desc, userId } = req.body;
            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const resultOfCheckAvailability = await checkavailabilityOfVault(userId)
            if (!resultOfCheckAvailability) {
                return res.status(200).json({ message: 'Vault limit reached. Please subscribe to add more vaults.' });
            }
            const id = uuidv4();
            await vaultDatas.vaultDB.create({
                id: id,
                userId: userId,
                title: title,
                desc: desc,
                filePath: `/uploads/${file.filename}` ,
                fileType: file.mimetype,
                created: Date.now(),
                sharedTo: []
            });

            return res.status(200).json({ message: "success",id:id });
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }

    },
    getOneItem: async (req: Request, res: Response) => {
        try {
            const { id, userId } = req.body;
            const foundItem = await vaultDatas.vaultDB.findOne({ filter: { id: id } });
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
            const foundItemsByMyself = await vaultDatas.vaultDB.find({ filter: { userId: userId } });
            const sharedByOthers = await vaultDatas.vaultDB.find({ filter: { sharedTo: userId } });

            let basicVaults = [];
            let sharedByMe = [];
            foundItemsByMyself.map((i, k) => {
                if (i.sharedTo.length > 0) {
                    sharedByMe.push(i);
                }
            })

            if (!!foundItemsByMyself) {
                return res.status(200).json({
                    message: "success", data: {
                        basicVaults: foundItemsByMyself,
                        sharedByMe: sharedByMe,
                        sharedByOthers: sharedByOthers
                    }
                });
            } else {
                return res.status(404).json({ message: "Found failed" });
            }
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
    updateItem: async (req: any, res: Response) => {
        try {
            const { id, userId, title, desc } = req.body;
            const file = req.file
            const updatedItem = await vaultDatas.vaultDB.update({ filter: { id: id, userId: userId }, update: { title: title, desc: desc, filePath: `/uploads/${file.filename}`, fileType: file.mimetype } });
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
            const deletedItem = await vaultDatas.vaultDB.remove({ filter: { id: id } });
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

    shareItem: async (req: Request, res: Response) => {
        try {
            const { id, recevierId } = req.body;
            const foundItem = await vaultDatas.vaultDB.findOne({ filter: { id: id } });
            const senderId = foundItem.userId;
            if (!foundItem.sharedTo.includes(recevierId)) {
                foundItem.sharedTo.push(recevierId);
            } else {
                return res.status(302).send({ message: "error", data: "Already Shared" });
            }

            const addedShares = foundItem.sharedTo;
            const updatedItem = await vaultDatas.vaultDB.update({ filter: { id: id }, update: { sharedTo: addedShares } });

            emitNotificationOfVault(senderId, recevierId, updatedItem, true)

            const mailOptions = {
                from: 'jillianhereda@gmail.com',
                to: recevierId,
                subject: `Download funeral home app`,
                text: `Click on the following link to download app:`,
                html: `<p>Click on the following link to download app:</p><a href="https://www.apple.com/app-store/">Download app</a>`,
            };
            const info = await transporter.sendMail(mailOptions);
            return res.status(200).send({ message:"success",data:info.response || null });
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
    unShareItem: async (req: Request, res: Response) => {
        try {
            const { id, recevierId } = req.body;
            const foundItem = await vaultDatas.vaultDB.findOne({ filter: { id: id } });
            const senderId = foundItem.userId;
            const removeFromSharedTo = (foundItem, receiverId) => {
                foundItem.sharedTo = foundItem.sharedTo.filter(id => id !== receiverId);
            }
            if (foundItem.sharedTo.includes(recevierId)) {
                removeFromSharedTo(foundItem, recevierId);
            } else {
                return res.status(302).send({ message: "error", data: " Already unshared item" });
            }

            const removedShares = foundItem.sharedTo;
            const updatedItem = await vaultDatas.vaultDB.update({ filter: { id: id }, update: { sharedTo: removedShares } });
            emitNotificationOfVault(senderId, recevierId, updatedItem, false);
            return res.status(200).send({ message:"success" });
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },

}

export default vaultController;