const { Router } = require("express")
const multer = require("multer");
const path = require("path")

const { handleReport, handleAllReport } = require("../controller/report")

const reportRouter = Router();

const { storage } = require("../config/cloudinary");

const upload = multer({ storage: storage })


reportRouter.post("/:id", upload.single("billImage"), handleReport)
reportRouter.get("/allreport", handleAllReport)

module.exports = reportRouter