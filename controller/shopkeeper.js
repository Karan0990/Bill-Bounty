const Shopkeeper = require("../models/shopkeeper")
const { verifyToken } = require("../service/authentication");
const axios = require("axios")



async function handleSignUp(req, res) {
    try {
        const { firstName, lastName, email, password, address, location, phoneNumber, storeName, role, gst } = req.body;

        const user = await Shopkeeper.create({
            firstName,
            lastName,
            email,
            gst,
            password,
            address,
            location,
            storeName,
            role: role || "shopkeeper",
            phoneNumber
        });


        return res.status(201).json({
            message: "User signed up successfully",
            user
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ error: "Error creating user" });
    }
}

async function handleVerifyGst(req, res) {

    try {
        const { gstNumber } = req.body;

        if (!gstNumber) {
            return res.status(400).json({ message: "GST number is required" });
        }

        // Example: calling a third-party GST verification API
        const response = await axios.get(
            `https://sheet.gstincheck.co.in/check/${process.env.GST_API_KEY}/${gstNumber}`
        );

        const gstData = response.data;

        if (gstData.flag) {
            return res.status(200).json({ valid: true, details: gstData });
        } else {
            return res.status(200).json({ valid: false });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "GST verification failed", error: error.message });
    }

}




async function handleLogin(req, res) {
    const { email, password } = req.body;

    try {
        const token = await Shopkeeper.machedPasswordandGenerateToken(email, password);


        return res
            .cookie("token", token, {
                httpOnly: true,
                secure: false, // set true in production with HTTPS
                sameSite: "lax",
            })
            .status(200)
            .json({
                message: "User login successful",
                loggedIn: true,
                token,
            });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(401).json({
            error: "Incorrect email or password",
            loggedIn: false,
        });
    }
}




async function handleCheckLogin(req, res) {
    const token = req.cookies?.token;

    if (!token) {
        return res.json({ loggedIn: false, message: "User not logged in" });
    }

    try {
        const userPayload = verifyToken(token);
        return res.json({ loggedIn: true, user: userPayload });
    } catch (err) {
        return res.json({ loggedIn: false, message: "Invalid token" });
    }
}



async function handleProfile(req, res) {
    try {
        const { id } = req.params;
        const user = await Shopkeeper.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (err) {
        console.error("Profile error:", err);
        return res.status(500).json({ error: "Error fetching user profile" });
    }
}




async function handleLogoutProfile(req, res) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.json({ message: "User not logged in" });
        }

        res.clearCookie("token");
        return res.json({ message: "User logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Error logging out" });
    }
}


async function handleAllShops(req, res) {
    try {
        const shops = await Shopkeeper.find({})
        return res.json({ shops })
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Error logging out" });
    }
}



module.exports = {
    handleSignUp,
    handleLogin,
    handleCheckLogin,
    handleProfile,
    handleLogoutProfile,
    handleAllShops,
    handleVerifyGst
};
