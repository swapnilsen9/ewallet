const express = require("express");
const cors = require("cors");
const https = require("https");
const PaytmChecksum = require("paytmchecksum");
const bodyParser = require('body-parser');
const mid = 'WYiPwd16006428833938';

let router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: false }));

var paytmParams = {};

router.route("/initiate").post((req, res) => {
  paytmParams.body = {
    requestType: "Payment",
    mid: mid,
    websiteName: "WEBSTAGING",
    orderId: "PYTM_" + Math.floor(Date.now() / 1000),
    callbackUrl: "https://e-wallet-testing.herokuapp.com/payments/payment_webhook",
    txnAmount: {
      value: req.body.amount,
      currency: "INR",
    },
    userInfo: {
      custId: req.body.custId,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
  };

  console.log(paytmParams);

  var paytmChecksum = PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    "Xp11&O_G&qf_mGTF"
  );
  paytmChecksum
    .then(function (checksum) {
      paytmParams.head = {
        signature: checksum,
      };

      var post_data = JSON.stringify(paytmParams);

      var options = {
        hostname: "securegw-stage.paytm.in",
        port: 443,
        path:
          "/theia/api/v1/initiateTransaction?mid=" +
          paytmParams.body.mid +
          "&orderId=" +
          paytmParams.body.orderId,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });

        post_res.on("end", function () {
          console.log('Order Id: '+paytmParams.body.orderId)
          console.log("Response: ",JSON.parse(response));
          var responseBody = JSON.parse(response);
          responseBody.orderId = paytmParams.body.orderId;
          responseBody.mid = mid;
          res.status(200).json(JSON.stringify(responseBody));
        });
      });

      post_req.write(post_data);
      post_req.end();
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.route('/payment_webhook').post((req, res) => {
  console.log(req.body);
  res.redirect('/payment-redirect.html?status='+req.body.STATUS+'&msg='+req.body.RESPMSG+'&amt='+req.body.TXNAMOUNT);
});

module.exports = router;
