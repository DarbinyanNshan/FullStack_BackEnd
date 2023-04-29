const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    userId: {
        type: String,
        default: null
    },
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    assigned: {
        type: String,
        default: null
    },
    status: {
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
module.exports = mongoose.model('Task', taskSchema)