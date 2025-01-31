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
	router.post("check-list/create", CheckList.controllers.newCheckList);
	router.post("check-list/getDetail", CheckList.controllers.getOneItem);
	router.post("check-list/getAllByUser", CheckList.controllers.getWholeItemsByUser);
	router.post("check-list/delete", CheckList.controllers.deleteItem);
	router.post("check-list/update", CheckList.controllers.updateItem);
	router.post("check-list/share", CheckList.controllers.shareItem);
	//vault
	router.post("vault/create", upload.single("file"),Vault.controllers.newVault);
	router.post("vault/getDetail", Vault.controllers.getOneItem);
	router.post("vault/getAllByUser", Vault.controllers.getWholeItemsByUser);
	router.post("vault/delete", Vault.controllers.deleteItem);
	router.post("vault/update", upload.single("file"), Vault.controllers.updateItem);
	router.post("vault/share", Vault.controllers.shareItem);

};

export { Routes };