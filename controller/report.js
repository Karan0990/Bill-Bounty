const Report = require("../models/report")
const Shopkeeper = require("../models/shopkeeper")



async function handleReport(req, res) {

    const user = req.user;

    if (!user) {
        return res.json("Make Login first")
    }

    if (user.role == "user") {

        const id = req.params.id


        const shop = await Shopkeeper.findById(id)

        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }


        const { billAmount } = req.body

        const reportRes = await Report.create({
            billAmount,
            user: user._id,
            shop: shop._id,
        })


        return res.json({ "Report Successful": reportRes })
    }


}


async function handleAllReport(req, res) {

    const user = req.user

    if (!user) {
        return res.json("Make Login first")
    }

    const userId = user._id

    const allReports = await Report.find({ user: userId }).populate("user")
        .populate("shop")

    return res.json({ allReports })



}

module.exports = { handleReport, handleAllReport }