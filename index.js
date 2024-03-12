import express from "express";
import userRoute from "./routes/userRoutes.js";
import "./db/connection.js";
import "./DotEnvImport.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(userRoute);

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
