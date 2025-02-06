import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'

import { Response, Request, NextFunction } from "express";
import { Now } from "../../utils";
import setlog from "../../utils/setlog";
import config from "../../../config.json";
import authDatas from "../data-access";
import authService from "../services";


const authController = {
	// This function is for signing up a new user.
	signup: async (req: Request, res: Response) => {
		try {
			const { name, email, password } = req.body;

			// service
			const existsMail = await authService.checkExistOfAccount({ name, email });
			if (existsMail.res === true) {
				throw new Error(`${existsMail.param} is already exist!`);
			};
			const hashedPassword = await bcrypt.hash(password, 10);
			// data access
			await authDatas.AuthDB.create({
				name: name,
				email: email,
				password: hashedPassword,
				isFullAccess: true,
				subscription: null,
				created: Date.now(),
				lasttime: Date.now(),
			});
			return res.status(200).json({ message: "success" });
		} catch (err) {
			setlog("request", err);
			return res.status(200).send({ message: err.message || "internal error" });
		}
	},
	login: async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			// data access
			const userData = await authDatas.AuthDB.findOne({
				filter: { $or: [{ email: email }] }
			});
			if (!userData) {
				return res.status(200).send({ message: "No exists user." });
			}
			// data access
			const isMatch = await bcrypt.compare(password, userData.password);
			if (!isMatch) {
				return res.status(400).send('Invalid username or password');
			}
			const data = {
				email: userData?.email,
				name: userData?.name,
			};
			const token = jwt.sign(data, config.JWT_SECRET, {
				expiresIn: "144h",
			});
			await authDatas.AuthDB.update({
				filter: { email: email },
				update: { lasttime: Date.now() }
			})
			return res.status(200).json({ message: "success", token: token, email: email, });
		} catch (err) {
			setlog("request", err);
			res.status(200).send({ message: "internal error" });
		}
	},
	getUserData: async (req: any, res: Response) => {
		try {
			const { userId } = req.body;
			const foundUserItem = await authDatas.AuthDB.findOne({ filter: { email: userId } })
			if (!!foundUserItem) {
				return res.status(200).json({ message: "success", data: foundUserItem })
			} else {
				return res.status(404).json({ message: "Found Failed" });
			}
		} catch (err) {
			setlog("request", err);
			return res.status(200).send({ message: err.message || 'internlal error' })
		}
	},
	middleware: (req: any, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization || "";
			jwt.verify(
				token,
				config.JWT_SECRET,
				async (err: any, userData: any) => {
					if (err) return res.sendStatus(403);
					const user = await authDatas.AuthDB.find({
						filter: {
							email: userData.email
						},
					});
					if (user.length == 0) return res.sendStatus(403);
					req.user = {
						name: userData.name,
						email: userData.email
					};
					authDatas.AuthDB.update({
						filter: {
							email: userData.email
						},
						update: {
							lasttime: Date.now()
						}
					});
					next();
				}
			);

		} catch (err: any) {
			if (err) return res.sendStatus(403);
		}
	}
}

export default authController;
