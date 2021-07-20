const mongoose = require('mongoose');

const userCredentialsSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : String,
    password : String,
    email : String,
    fName : String,
    lName : String,
    address : String,
    city : String,
    country : String,
    profileImage : String
});

module.exports = mongoose.model("User_Credentials", userCredentialsSchema);