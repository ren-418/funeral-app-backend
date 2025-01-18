import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from 'express-rate-limit'

// External Modules
import { Routes } from "./Routes";
import config from "../config.json";
import setlog from "./utils/setlog";

// Get router
const router: express.Router = express.Router();
const app: express.Express = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const connectDatabase = async (mongoUrl: string) => {
	try {
		const options = {
			autoCreate: true,
			keepAlive: true,
			retryReads: true,
		} as mongoose.ConnectOptions;
		mongoose.set("strictQuery", true);
		const result = await mongoose.connect(mongoUrl, options);
		if (result) {
			setlog("MongoDB connected");
		}
	} catch (err) {
		setlog("ConnectDatabase", err);
	}
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(limiter)
app.use(express.json());

// Frontend Render
if (!config.debug) {
	app.use(express.static(__dirname + "/build"));
	app.get("/*", function (req, res) {
		res.sendFile(__dirname + "/build/index.html", function (err) {
			if (err) {
				res.status(500).send(err);
			}
		});
	});
}

// API Router
Routes(router);
app.use("/api", router);


connectDatabase(config.DATABASE).then(() => {
	app.listen(config.PORT, () => {
		setlog(`Server listening on ${config.PORT} port`);
	});
}).catch((err: any) => {
	setlog(err);
});

export default app;