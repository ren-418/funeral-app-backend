import express from "express";
import Auth from "./auth";

const Routes = async (router: express.Router) => {

	//user
	router.post("/signup/register", Auth.controllers.signup);
	router.post("/login", Auth.controllers.login);

};

export { Routes };