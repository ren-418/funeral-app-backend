import express from "express";
import Auth from "./auth";
import CheckList from "./check-list";
import Vault from "./valut";
import Transaction from "./transaction"
import { upload } from "./middleware/upload";



const Routes = async (router: express.Router) => {

	//user
	router.post("/signup", Auth.controllers.signup);
	router.post("/login", Auth.controllers.login);
	router.post("/google-login", Auth.controllers.googleLogin);
	router.post("/apple-login", Auth.controllers.appleLogin);
	router.post("/getUserData", Auth.controllers.middleware, Auth.controllers.getUserData);
	//check-list
	router.post("/check-list/create", Auth.controllers.middleware, CheckList.controllers.newCheckList);
	router.post("/check-list/getDetail", Auth.controllers.middleware, CheckList.controllers.getOneItem);
	router.post("/check-list/getAllByUser", Auth.controllers.middleware, CheckList.controllers.getWholeItemsByUser);
	router.post("/check-list/delete", Auth.controllers.middleware, CheckList.controllers.deleteItem);
	router.post("/check-list/update", Auth.controllers.middleware, CheckList.controllers.updateItem);
	router.post("/check-list/share", Auth.controllers.middleware, CheckList.controllers.shareItem);
	router.post("/check-list/unshare", Auth.controllers.middleware, CheckList.controllers.unShareItem);
	//vault
	router.post("/vault/create", Auth.controllers.middleware, upload.single("file"), Vault.controllers.newVault);
	router.post("/vault/getDetail", Auth.controllers.middleware, Vault.controllers.getOneItem);
	router.post("/vault/getAllByUser", Auth.controllers.middleware, Vault.controllers.getWholeItemsByUser);
	router.post("/vault/delete", Auth.controllers.middleware, Vault.controllers.deleteItem);
	router.post("/vault/update", Auth.controllers.middleware, upload.single("file"), Vault.controllers.updateItem);
	router.post("/vault/share", Auth.controllers.middleware, Vault.controllers.shareItem);
	router.post("/vault/unshare", Auth.controllers.middleware, Vault.controllers.unShareItem);
	//transaction
	router.post("/transaction/create", Auth.controllers.middleware, Transaction.controllers.newTransaction)
	router.post("/transaction/create-order", Auth.controllers.middleware, Transaction.controllers.createOrder)
	router.post("/transaction/capture-order", Auth.controllers.middleware, Transaction.controllers.captureOrder)
};

export { Routes };