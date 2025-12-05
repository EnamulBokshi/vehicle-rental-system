import { Router } from "express";
import authController from "./auth.controllers";

const authRoute = Router();


authRoute.post("/signup", authController.signUp);
authRoute.post("/signin",authController.login);


export default authRoute;