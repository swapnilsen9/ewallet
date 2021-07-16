const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

let router = express.Router();

const UserCredentials = require("../models/user_credentials");
const UserWallet = require("../models/user_wallet");

router.use(cors());
router.use(express.json());

router.route('/wallet-balance/:userId').get((req, res) => {
    UserWallet.findOne({ userId: req.params.userId, }, null, {
        limit: 1,
      })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({ amount : result.Amount });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ msg : 'Server Failure' });
        });
});

router.route("/update-wallet/:userId").patch((req, res) => {
  UserWallet.findOne({ userId: req.params.userId, }, null, {
    limit: 1,
  })
    .exec()
    .then((result2) => {
        if(result2.lastTxnId != req.body.lastTxnId){
            var body = {
                Amount: parseInt(req.body.amount) + parseInt(result2.Amount),
                lastTxnId : req.body.lastTxnId
              };
            UserWallet.findOneAndUpdate(
                {
                  userId: req.params.userId,
                },
                body,
                { new: true }
              )
                .exec()
                .then((result) => {
                  console.log(result);
                  if (result === null) {
                    res.status(404).json({ updated: false, message: "Record Not Found" });
                  } else {
                    res.status(200).json({ updated: true, updatedRecord: result });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json(err);
                });
        }else{
            res.status(400).json({ updated: false, message: "Duplicate Entry" });
        }
    });
});

module.exports = router;
