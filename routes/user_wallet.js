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
                Amount: parseFloat(req.body.amount).toFixed(2) + parseFloat(result2.Amount).toFixed(2),
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

router.route('/send').patch((req, res) => {
  UserCredentials.findOne(
    { $or: [{ username: req.body.recieverId }, { email: req.body.recieverId }] },
    null,
    {
      limit: 1,
    }
  )
    .exec()
    .then((userCredentialresult) => {
      if(userCredentialresult === null){
        res.status(400).json({ success : false, msg : 'User Not Found' });
      }else{
        UserWallet.findOne(
          { userId: userCredentialresult._id, },
          null,
          {
            limit: 1,
          }
        )
          .exec()
          .then((userWalletRecieverResult) => {
            if(userWalletRecieverResult === null){
              res.status(400).json({ success : false, msg : 'User Not Found' });
            }else{
              var body = {
                Amount : parseFloat(req.body.amount).toFixed(2) + parseFloat(userWalletRecieverResult.Amount).toFixed(2)
              }
              UserWallet.findOneAndUpdate(
                {
                  userId: userWalletRecieverResult.userId,
                },
                body,
                { new: true }
              )
                .exec()
                .then((userWalletRecieverUpdateResult) => {
                  if(userWalletRecieverUpdateResult === null){
                    res.status(400).json( {error : 'Money Could Not be Sent'} );
                  }else{
                    UserWallet.findOne(
                      { userId: req.body.senderId },
                      null,
                      {
                        limit: 1,
                      }
                    )
                      .exec()
                      .then((userWalletSenderResult) => {
                        body = {
                          Amount : parseFloat(userWalletSenderResult.Amount).toFixed(2) - parseFloat(req.body.amount).toFixed(2) 
                        }
                        UserWallet.findOneAndUpdate(
                          {
                            userId: req.body.senderId,
                          },
                          body,
                          { new: true }
                        )
                          .exec()
                          .then((userWalletSenderUpdateResult) => {
                            if(userWalletSenderUpdateResult != null && userWalletSenderUpdateResult != undefined
                              && userWalletSenderUpdateResult._id != null && userWalletSenderUpdateResult._id != undefined){
                                res.status(200).json( {success : true, msg : 'Amount Sent'} );
                              }
                              else{
                                res.status(400).json( {error : 'Money Could Not be Sent'} );
                              }
                          })
                          .catch((err) => {
                            console.log('1'+err);
                            res.status(500).json( {error : err} );
                          });
                      })
                      .catch((err) => {
                        console.log('2'+err);
                        res.status(500).json( {error : err} );
                      })
                  }
                })
                .catch((err) => {
                  console.log('3'+err);
                  res.status(500).json( {error : err} );
                });
            }
          })
          .catch((err) => {
            console.log('4'+err);
            res.status(500).json( {error : err} );
          })
      }
    })
    .catch((err) => {
      console.log('5'+err);
      res.status(500).json( {error : err} );
    });

});

module.exports = router;
