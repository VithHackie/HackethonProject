const mongoose = require("mongoose")


const neederSchema = mongoose.Schema({
    name : String,
    orgName : String,
    phone : Number,
    people : Number
})

module.exports = mongoose.model("needer", neederSchema)