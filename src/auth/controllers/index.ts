import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { Now } from "../../utils";
import setlog from "../../utils/setlog";
import config from "../../../config.json";
import { toChecksumAddress } from "../../utils/blockchain";
import authDatas from "../data-access";
import authService from "../services";

const authController = {
	// This function is for signing up a new user.
	signup: async (req: Request, res: Response) => {
		try {
			const { name, email, address, sign } = req.body;

			// service
			const existsMail = await authService.checkExistOfAccount({ name, email, address });
			if (existsMail.res === true) {
				throw new Error(`${existsMail.param} is already exist!`);
			};

			// service
			if (!authService.verifySignature({ sig: sign, address: address })) {
				throw new Error("invalid signature")
			};

			// data access
			await authDatas.AuthDB.create({
				name: name,
				email: email,
				address: toChecksumAddress(address),
				created: Now(),
				lasttime: Now(),
			});

			return res.status(200).json({ message: "success" });
		} catch (err) {
			setlog("request", err);
			return res.status(200).send({ message: err.message || "internal error" });
		}
	},
	login: async (req: Request, res: Response) => {
		try {
			const { address, sign } = req.body;

			// service
			if (!authService.verifySignature({ sig: sign, address: address })) {
				throw new Error("invalid signature")
			};
			// data access
			const userData = await authDatas.AuthDB.findOne({
				filter: { $or: [{ address: toChecksumAddress(address) }] }
			});
			if (!userData) {
				return res.status(200).send({ message: "No exists user." });
			}

			// data access
			const data = {
				email: userData?.email,
				name: userData?.name,
				address: toChecksumAddress(address)
			};
			const token = jwt.sign(data, config.JWT_SECRET, {
				expiresIn: "144h",
			});
			await authDatas.AuthDB.update({
				filter: { address: data.address },
				update: { lasttime: Now() }
			})
			return res.status(200).json({ message: "success", token });
		} catch (err) {
			setlog("request", err);
			res.status(200).send({ message: "internal error" });
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
							lasttime: Now()
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
