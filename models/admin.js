const { Schema, model } = require("mongoose")
const { randomBytes, createHmac } = require("crypto");
const { timeStamp } = require("console");
const { createToken } = require("../service/authentication");
const { type } = require("os");

const adminSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    address: {
        street: { type: String, required: true },
        locality: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },

    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phoneNumber: {
        type: Number,
        required: true,

    },
    role: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    salt: {
        type: String
    }
}, { timestamps: true })


adminSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified()) { return next(); }

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword

    next();
})

adminSchema.statics.machedPasswordandGenerateToken = async function (email, password) {

    const user = await this.findOne({ email });


    if (!user) { throw new Error("User not Found") }

    const salt = user.salt;
    const hashedPassword = user.password;

    const providedHashedPassword = createHmac("sha256", salt).update(password).digest("hex");

    if (hashedPassword !== providedHashedPassword) { throw new Error("Password not matched") }

    const token = createToken(user)

    return token;
}

const Admin = model("admin", adminSchema)

module.exports = Admin
