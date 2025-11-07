const JWT = require("jsonwebtoken")

const secret = "karan@123";

function createToken(user) {
    const payLoad = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        street: user.address.street,
        locality: user.address.locality,
        city: user.address.city,
        state: user.address.state,
        pincode: user.address.pincode,
        role: user.role,

    }

    const token = JWT.sign(payLoad, secret);
    return token
}

function verifyToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = { createToken, verifyToken }