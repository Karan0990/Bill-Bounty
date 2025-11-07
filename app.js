const express = require("express");
const { connectdb } = require("./database/mongoose")
const userRouter = require("./route/user")
const shopkeeperRouter = require("./route/shopkeeper")
const reportRouter = require("./route/report")
const adminRouter = require("./route/admin")
const { checkForAuthentication } = require("./middleware/authentication")
const cookieParser = require("cookie-parser")
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(checkForAuthentication("token"));


connectdb("mongodb://127.0.0.1:27017/BillBounty").then((err) => { console.log("MonogoDb Connected") })



app.use("/", userRouter);
app.use("/shopkeeper", shopkeeperRouter);
app.use("/report", reportRouter);
app.use("/admin", adminRouter);


app.listen(PORT, () => { console.log(`Server Started At PORT : ${PORT}`) });

