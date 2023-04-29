const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: {
        type: String,
        default: null
    },
    fristName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    createdAt:{
        type:Number,
        require:true,
    },
    updatedAt:{
        type:Number,
        require:true,
        default:null,
    },
})
module.exports = mongoose.model('User', userSchema)