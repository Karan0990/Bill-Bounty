const mongoose = require("mongoose")


function connectdb(url) {
    return mongoose.connect(url)
}
module.exports = { connectdb }
