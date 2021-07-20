const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync("./rsa-key/private.pem");

const saltRounds = 10;

let router = express.Router();

const UserCredentials = require("../models/user_credentials");
const UserWallet = require("../models/user_wallet");

router.use(cors());
router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    const auth = {login: 'e-wallet-admin', password: 'b4?9*TGLZ`x>fh\('} // change this

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  if (login && password && login === auth.login && password === auth.password) {
    //Get All Credentials
    UserCredentials.find()
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    }else{
      res.status(401).json({msg : "User Unauthorized"});
    }
  })
  .post((req, res) => {
    console.log(req.body);
    UserCredentials.findOne(
      { $or: [{ username: req.body.username }, { email: req.body.email }] },
      null,
      {
        limit: 1,
      }
    )
      .exec()
      .then((result) => {
        if (result === null) {
          bcrypt
            .hash(req.body.password, saltRounds)
            .then((hash) => {
              const userCredential = new UserCredentials({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash,
                email: req.body.email,
                fName: req.body.fName,
                lName: req.body.lName,
                address: req.body.address,
                city: req.body.city,
                country: req.body.country,
              });
              userCredential
                .save()
                .then((result) => {
                  console.log(result);
                  const userWalletDetails = new UserWallet({
                    _id: new mongoose.Types.ObjectId(),
                    userId: result._id,
                    Amount: 0,
                    lastTxnId : 0
                  });
                  userWalletDetails.save().then((walletResult) => {
                    res.status(201).json({
                      success: true,
                      message: "Record Created Successfully",
                      createdRecord: result,
                      createdWalletRecord: walletResult,
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({
                    message: "Record Creation Unsuccessful",
                    error: error,
                  });
                });
            })
            .catch((err) => {
              console.log("Hashing Error: " + err);
            });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Username Already Exists!" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  })
  .delete((req, res) => {
    UserCredentials.findOneAndDelete({
      $or: [
        { username: req.body.sessionUserName },
        { email: req.body.sessionUserName },
      ],
    })
      .exec()
      .then((result) => {
        console.log(result);
        if (result === null) {
          res
            .status(404)
            .json({ deleted: false, message: "Couldn't Find Data" });
        } else {
          res.status(200).json({ deleted: true, message: result });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  })
  .patch((req, res) => {
    if (req.body.username !== null && req.body.email !== null) {
      UserCredentials.findOne({ username: req.body.username }, null, {
        limit: 1,
      })
        .exec()
        .then((result) => {
          if (result === null) {
            var body = {};
            if (req.body.username != null) body.username = req.body.username;
            if (req.body.email != null) body.email = req.body.email;
            if (req.body.fName != null) body.fName = req.body.fName;
            if (req.body.lName != null) body.lName = req.body.lName;
            if (req.body.address != null) body.address = req.body.address;
            if (req.body.city != null) body.city = req.body.city;
            if (req.body.country != null) body.country = req.body.country;
            UserCredentials.findOneAndUpdate(
              {
                $or: [
                  { username: req.body.sessionUserName },
                  { email: req.body.sessionUserName },
                ],
              },
              body,
              { new: true }
            )
              .exec()
              .then((result) => {
                console.log(result);
                if (result === null) {
                  res
                    .status(404)
                    .json({ updated: false, message: "Record Not Found" });
                } else {
                  res
                    .status(200)
                    .json({ updated: true, updatedRecord: result });
                }
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json(err);
              });
          } else {
            res.status(400).json({
              success: false,
              message: "Username Already Exists!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    } else {
      var body = {};
      if (req.body.username != null) body.username = req.body.username;
      if (req.body.email != null) body.email = req.body.email;
      if (req.body.fName != null) body.fName = req.body.fName;
      if (req.body.lName != null) body.lName = req.body.lName;
      if (req.body.address != null) body.address = req.body.address;
      if (req.body.city != null) body.city = req.body.city;
      if (req.body.country != null) body.country = req.body.country;
      UserCredentials.findOneAndUpdate(
        {
          $or: [
            { username: req.body.sessionUserName },
            { email: req.body.sessionUserName },
          ],
        },
        body,
        { new: true }
      )
        .exec()
        .then((result) => {
          console.log(result);
          if (result === null) {
            res
              .status(404)
              .json({ updated: false, message: "Record Not Found" });
          } else {
            res.status(200).json({ updated: true, updatedRecord: result });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });

router.route("/authenticate").post((req, res) => {
  UserCredentials.find(
    { $or: [{ username: req.body.username }, { email: req.body.username }] },
    null,
    {
      limit: 1,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      if (result.length > 0) {
        result.forEach((user) => {
          bcrypt
            .compare(req.body.password, user.password)
            .then(function (result) {
              if (result === true) {
                var tokenPayload = {
                  username: req.body.username,
                  password: req.body.password,
                };
                var token = jwt.sign(tokenPayload, privateKey, {
                  algorithm: "RS256",
                  expiresIn: 60 * 60,
                });
                res.status(200).json({ success: true, access_token: token });
              } else {
                res.status(401).json({ message: "Unauthorized" });
              }
            });
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.route("/:username").get((req, res) => {
  //Get One Credentials
  UserCredentials.findOne(
    {
      $or: [{ username: req.params.username }, { email: req.params.username }],
    },
    null,
    {
      limit: 1,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.route("/upload").patch((req, res) => {
  var imageBuffer = new Buffer.from(req.body.profileImage, "base64");

  fs.writeFile(
    "./uploads/" + req.body.sessionUserName + "_profileImg.png",
    imageBuffer,
    function (err) {
      if (err) console.log(err);
    }
  );

  var body = {
    profileImage: "/uploads/" + req.body.sessionUserName + "_profileImg.png",
  };
  UserCredentials.findOneAndUpdate(
    {
      $or: [
        { username: req.body.sessionUserName },
        { email: req.body.sessionUserName },
      ],
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
});

module.exports = router;
