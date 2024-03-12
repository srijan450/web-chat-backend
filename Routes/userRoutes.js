import { Router } from "express";
import { test, verifyUsername } from "../controller/userController.js";

const userRoute = Router();

userRoute.get("/", test);

userRoute.get('/verify-username', verifyUsername);

export default userRoute;
