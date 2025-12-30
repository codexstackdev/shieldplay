import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    password: {type:String, required: true},
    role: {type:String, enum: ["user", "admin", "tester"], default: "user"},
    profile: {type:String, default: ""},
    profileId: {type:String, default: ""}
}, {timestamps: true});

const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;