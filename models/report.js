const { Schema, model } = require("mongoose")
const { randomBytes, createHmac } = require("crypto");
const { timeStamp } = require("console");
const { createToken } = require("../service/authentication");
const { type } = require("os");

const reportSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "shopkeeper"
    },

    billAmount: {
        type: Number,
        require: true,
    },

    billImage: {
        type: String,
        required: false,
    }

}, { timestamps: true })


const Report = model("report", reportSchema)

module.exports = Report
