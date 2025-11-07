const { Router } = require("express")

const { handleReport, handleAllReport } = require("../controller/report")

const reportRouter = Router();


reportRouter.post("/:id", handleReport)
reportRouter.get("/allreport", handleAllReport)

module.exports = reportRouter