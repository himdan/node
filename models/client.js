const mongoose  = require('mongoose')
const Repository = require('../repository/repository')
const cSchema = {
    ip: {
        type: String,
        required: true,
    },
    remote:{
        type: Boolean,
        default: false,
    },
    connectedAt:{
        type: Date,
        required: true,
        default: Date.now
    }
}
const clientSchema = new mongoose.Schema(cSchema);
const model = mongoose.model('Client', clientSchema);
model.repository = new Repository(model, cSchema)
module.exports = model
