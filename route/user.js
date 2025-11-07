const { Router } = require("express")

const { handleSignUp, handleLogin, handleCheckLogin, handleLogoutProfile, handleProfile } = require("../controller/user")

const userRouter = Router();


userRouter.get("/signup", (req, res) => {
    return res.render("signup");

})

userRouter.post("/signup", handleSignUp)

userRouter.get("/login", (req, res) => {
    return res.render("login");
})

userRouter.post("/login", handleLogin)

userRouter.get("/checklogin", handleCheckLogin)
userRouter.get("/profile/:id", handleProfile)
userRouter.get("/logout", handleLogoutProfile)


module.exports = userRouter