import express from "express";
import Auth from "./auth";
import CheckList from "./check-list";
import Vault from "./valut";
import { upload } from "./middleware/upload";



const Routes = async (router: express.Router) => {

	//user
	router.post("/signup", Auth.controllers.signup);
	router.post("/login", Auth.controllers.login);
	//check-list
	router.post("/check-list/create", Auth.controllers.middleware, CheckList.controllers.newCheckList);
	router.post("/check-list/getDetail", Auth.controllers.middleware, CheckList.controllers.getOneItem);
	router.post("/check-list/getAllByUser", Auth.controllers.middleware, CheckList.controllers.getWholeItemsByUser);
	router.post("/check-list/delete", Auth.controllers.middleware, CheckList.controllers.deleteItem);
	router.post("/check-list/update", Auth.controllers.middleware, CheckList.controllers.updateItem);
	router.post("/check-list/share", Auth.controllers.middleware, CheckList.controllers.shareItem);
	//vault
	router.post("/vault/create", Auth.controllers.middleware, upload.single("file"), Vault.controllers.newVault);
	router.post("/vault/getDetail", Auth.controllers.middleware, Vault.controllers.getOneItem);
	router.post("/vault/getAllByUser", Auth.controllers.middleware, Vault.controllers.getWholeItemsByUser);
	router.post("/vault/delete", Auth.controllers.middleware, Vault.controllers.deleteItem);
	router.post("/vault/update", Auth.controllers.middleware, upload.single("file"), Vault.controllers.updateItem);
	router.post("/vault/share", Auth.controllers.middleware, Vault.controllers.shareItem);

};

export { Routes };