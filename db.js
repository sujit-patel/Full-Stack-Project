import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/demoApp');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    pass: String,
    imgUrl: String
});


const userModel = mongoose.model('user', userSchema);

export default userModel;