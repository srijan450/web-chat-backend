const express = require("express");
const userRoute = require("./Routes/userRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(userRoute);

app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
});