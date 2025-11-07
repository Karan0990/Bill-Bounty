const User = require("../models/user");
const { verifyToken } = require("../service/authentication");



async function handleSignUp(req, res) {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            address,
            location, // include latitude & longitude
            role,
        } = req.body;

        // Validation: make sure required fields exist
        // if (
        //     !firstName ||
        //     !lastName ||
        //     !email ||
        //     !password ||
        //     !phoneNumber ||
        //     !address ||
        //     !address.street ||
        //     !address.locality ||
        //     !address.city ||
        //     !address.state ||
        //     !address.pincode
        // ) {
        //     return res.status(400).json({ error: "All fields are required" });
        // }

        // Prepare location for GeoJSON
        const geoLocation = location?.latitude && location?.longitude
            ? {
                type: "Point",
                coordinates: [location.longitude, location.latitude], // [lng, lat]
            }
            : { type: "Point", coordinates: [0, 0] }; // default if not provided

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber: phoneNumber.toString(),
            role: role || "user",
            address,
            location: geoLocation,
        });

        return res.status(201).json({
            message: "User signed up successfully",
            success: true,
            user,
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ error: "Error creating user" });
    }
}




async function handleLogin(req, res) {
    const { email, password } = req.body;

    try {
        const token = await User.machedPasswordandGenerateToken(email, password);


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
        const user = await User.findById(id).select("-password");

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



module.exports = {
    handleSignUp,
    handleLogin,
    handleCheckLogin,
    handleProfile,
    handleLogoutProfile
};
