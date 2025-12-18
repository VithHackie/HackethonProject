const mongoose = require('mongoose')


const helperSchema = mongoose.Schema({
    name : String,
    resName : String,
    phone : Number,
    foodType : String,
    amount : Number
})

module.exports = mongoose.model("helper", helperSchema)