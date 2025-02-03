
import { Response, Request, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer'

import { Now } from "../../utils";
import setlog from "../../utils/setlog";
import config from "../../../config.json";

import checkListDatas from "../data-access";
import { emitNotificationOfCheckList } from "../../socket";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jillianhereda@gmail.com',
        pass: 'qgji beki zrjm fzqn',
    },
});

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
                created: Date.now(),
                sharedTo: []
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
            const foundItemsByMyself = await checkListDatas.checkListDB.find({ filter: { userId: userId } });
            const sharedByOthers = await checkListDatas.checkListDB.find({ filter: { sharedTo: userId } });

            let basicCheckList = [];
            let sharedByMe = [];
            foundItemsByMyself.map((i, k) => {
                if (i.sharedTo.length > 0) {
                    sharedByMe.push(i);
                } else {
                    basicCheckList.push(i);
                }
            })

            if (!!foundItemsByMyself) {
                return res.status(200).json({
                    message: "success", data: {
                        basicCheckList: basicCheckList,
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
    updateItem: async (req: Request, res: Response) => {
        try {
            const { id, userId, title, desc, completed } = req.body;
            const result = await checkListDatas.checkListDB.update({ filter: { id: id, userId: userId }, update: { title: title, desc: desc, completed: completed } });
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
    shareItem: async (req: Request, res: Response) => {
        try {
            const { id, recevierId } = req.body;
            const foundItem = await checkListDatas.checkListDB.findOne({ filter: { id: id } });
            const senderId = foundItem.userId
            if (!foundItem.sharedTo.includes(recevierId)) {
                foundItem.sharedTo.push(recevierId);
            } else {
                return res.status(302).send({ message:"error",data: "Already Shared" });
            }
            
            const addedShares = foundItem.sharedTo;
            console.log("addedShares :::", addedShares, recevierId);
            const updatedItem = await checkListDatas.checkListDB.update({ filter: { id: id }, update: { sharedTo: addedShares } });

            emitNotificationOfCheckList(senderId, recevierId, updatedItem, true)

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
            const foundItem = await checkListDatas.checkListDB.findOne({ filter: { id: id } });
            const senderId = foundItem.userId;
            const removeFromSharedTo = (foundItem, receiverId) => {
                foundItem.sharedTo = foundItem.sharedTo.filter(id => id !== receiverId);
            }
            if (foundItem.sharedTo.includes(recevierId)) {
                removeFromSharedTo(foundItem, recevierId);
            } else {
                return res.status(302).send({ message: "error", data: "Already unshared item" });
            }
    
            const removedShares = foundItem.sharedTo;
            const updatedItem = await checkListDatas.checkListDB.update({ 
                filter: { id: id }, 
                update: { sharedTo: removedShares } 
            });
            emitNotificationOfCheckList(senderId, recevierId, updatedItem, false);
            return res.status(200).send({ message:"success" });
        } catch (err) {
            setlog("request", err);
            return res.status(200).send({ message: err.message || "internal error" });
        }
    },
    
}

export default checkListController