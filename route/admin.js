const { Router } = require("express")

const { getAdminDashboard, handleSignUp, handleLogin } = require("../controller/admin")

const adminRouter = Router();

adminRouter.post("/signup", handleSignUp)

adminRouter.get("/login", (req, res) => {
    return res.render("login");
})

adminRouter.post("/login", handleLogin)

adminRouter.get("/adminallshops", getAdminDashboard)

module.exports = adminRouter