const Report = require("../models/report");
const Shopkeeper = require("../models/shopkeeper");

async function handleReport(req, res) {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Please login first" });
        }

        if (user.role !== "user") {
            return res.status(403).json({ message: "Only users can report" });
        }

        const id = req.params.id;
        const shop = await Shopkeeper.findById(id);

        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        // ✅ use the correct key name
        const { amount } = req.body;

        // ✅ multer + Cloudinary upload check
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "No bill image uploaded" });
        }

        // ✅ Cloudinary already handles file.path internally via storage adapter
        const imageUrl = req.file.path; // Cloudinary returns URL in 'path'

        // ✅ create report
        const reportRes = await Report.create({
            billAmount: amount,
            user: user._id,
            shop: shop._id,
            billImage: imageUrl,
        });

        return res.json({ message: "Report submitted successfully", report: reportRes });
    } catch (error) {
        console.error("Error in handleReport:", error);
        res.status(500).json({ message: "Failed to submit report", error: error.message });
    }
}

async function handleAllReport(req, res) {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Please login first" });
    }

    const allReports = await Report.find({ user: user._id })
        .populate("user")
        .populate("shop");

    return res.json({ allReports });
}

module.exports = { handleReport, handleAllReport };
