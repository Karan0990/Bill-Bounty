const { Router } = require("express")

const { handleSignUp, handleLogin, handleCheckLogin, handleLogoutProfile, handleProfile, handleAllShops, handleVerifyGst } = require("../controller/shopkeeper")

const shopkeeperRouter = Router();


shopkeeperRouter.get("/allshops", handleAllShops)


shopkeeperRouter.get("/signup", (req, res) => {
    return res.render("signup");

})

shopkeeperRouter.post("/signup", handleSignUp)
shopkeeperRouter.post("/verifygst", handleVerifyGst)


shopkeeperRouter.get("/login", (req, res) => {
    return res.render("login");
})

shopkeeperRouter.post("/login", handleLogin)

shopkeeperRouter.get("/checklogin", handleCheckLogin)
shopkeeperRouter.get("/profile/:id", handleProfile)
shopkeeperRouter.get("/logout", handleLogoutProfile)


module.exports = shopkeeperRouter