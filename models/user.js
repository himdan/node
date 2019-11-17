const mongoose  = require('mongoose')
const Repository = require('../repository/repository')
const schema = {
    username: {
        type: String,
        required: true,
        unique: true,

    },
    email:{
        type: String,
        default: false,
        required: true,
        unique: true,

    },
    password:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
}
const Schema = new mongoose.Schema(schema);
const model = mongoose.model('User', Schema);
model.repository = new Repository(model, schema)
module.exports = model
