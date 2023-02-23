const { Router } = require("express");
const { test } = require("../controller/userController");

const userRoute = Router();

userRoute.get("/", test);

module.exports = userRoute;