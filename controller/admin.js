const Admin = require("../models/admin");
const Shopkeeper = require("../models/shopkeeper")
const Report = require("../models/report");


async function handleSignUp(req, res) {
    try {
        const { firstName, lastName, email, password, address, location, phoneNumber, role } = req.body;

        const user = await Admin.create({
            firstName,
            lastName,
            address,
            location,
            email,
            password,
            role: role || "admin",
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




async function handleLogin(req, res) {
    const { email, password } = req.body;

    try {
        const token = await Admin.machedPasswordandGenerateToken(email, password);


        return res
            .cookie("token", token, {
                httpOnly: true,
                secure: false,
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


async function getAdminDashboard(req, res) {
    try {
        const user = req.user;
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const totalShops = await Shopkeeper.countDocuments();

        const totalReports = await Report.countDocuments();

        // 3️⃣ Reports per shop
        const shopReports = await Report.aggregate([
            {
                $group: {
                    _id: "$shop",
                    totalReports: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "shopkeepers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "shop"
                }
            },
            {
                $unwind: "$shop"
            },
            {
                $project: {
                    _id: 0,
                    shopId: "$shop._id",
                    shopName: { $concat: ["$shop.firstName", " ", "$shop.lastName"] },
                    totalReports: 1
                }
            }
        ]);

        const shops = await Shopkeeper.find({}, { password: 0 });

        return res.status(200).json({
            totalShops,
            totalReports,
            shopReports,
            shops
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { getAdminDashboard, handleSignUp, handleLogin };
