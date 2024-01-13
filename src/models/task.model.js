import mongoose from "mongoose";
 
const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    user:{
        type: String,
        ref: 'User',
        required: true,
    },
 },{
    timestamps: true
 });

 export default mongoose.model("Task", taskSchema);