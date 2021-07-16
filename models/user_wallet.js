const mongoose = require('mongoose');

const userWalletSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    userId : String,
    Amount : Number,
    lastTxnId : String
});

module.exports = mongoose.model("User_Wallet", userWalletSchema);