const instanceUrl = window.location.origin;

$(function () {
  let sessionUserName = localStorage.getItem("userName");
  if (sessionUserName === null) {
    location.href = "./404.html";
  } else {
    fetch(instanceUrl + "/user_credentials/" + sessionUserName, {
      method: "GET", // POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            $("#nameOfUser").html(data.fName + " " + data.lName);
            if (data.profileImage !== undefined) {
              $("#headerProfileImg").attr(
                "src",
                instanceUrl + data.profileImage
              );
            }
          });
        }
      })
      .catch((err) => {});
  }
  updateWalletAmount();
});

$("#addMoneyBtn").click((evt) => {
  evt.preventDefault();
  $('#spinner').attr('style','');
  let sessionUserName = localStorage.getItem("userName");
  console.log(sessionUserName);
  if (sessionUserName === null) {
    location.href = "./404.html";
  } else {
    fetch(instanceUrl + "/user_credentials/" + sessionUserName, {
      method: "GET", // POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            var amt = parseFloat($("#amount").val());
            var paymentBody = {
              amount: amt,
              custId: data._id,
              email: data.email,
              firstName: data.fName,
              lastName: data.lName,
            };
            fetch(instanceUrl + "/payments/initiate", {
              method: "POST", // POST, PUT, DELETE, etc.
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(paymentBody),
            })
              .then((response2) => {
                if (response2.status == 200) {
                  response2.json().then((data2) => {
                    localStorage.setItem('payment_details', data2);
                    window.open(instanceUrl+'/payment.html', '_self');
                  });
                }
              });
          });
        }
      })
      .catch((err) => {});
  }
});

$("#sendMoneyBtn").click((evt) => {
  evt.preventDefault();
  let sessionUserId = localStorage.getItem("userId");
  console.log(sessionUserId);
  var sendMoneyBody = {
    amount : parseFloat($("#sendAmount").val()).toFixed(2),
    recieverId : $("#sendAddress").val(),
    senderId : sessionUserId
  }
  if (sessionUserId === null) {
    location.href = "./404.html";
  } else {
    console.log(parseFloat($('#walletBalance').html().split('₹')[1].split('<br>')[0]).toFixed(2));
    console.log(parseFloat(sendMoneyBody.amount).toFixed(2));
    console.log(parseFloat($('#walletBalance').html().split('₹')[1].split('<br>')[0]) >= parseFloat(sendMoneyBody.amount));
    if(parseFloat($('#walletBalance').html().split('₹')[1].split('<br>')[0]) >= (sendMoneyBody.amount)){
      $('#spinner2').attr('style','');
      fetch(instanceUrl + "/user_wallet/send", {
        method: "PATCH", // POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify(sendMoneyBody)
      })
        .then((response) => {
          if (response.status == 200) {
            response.json().then((data) => {
              if(data.success === true){
                alert('Money Sent Successfully!');
                $('#sendMoneyModal').modal('hide');
                $("#sendAddress").val('');
                $("#sendAmount").val('');
                $('#spinner2').attr('style','display:none');
                updateWalletAmount();
              }
            });
          }else if(response.status == 400){
            response.json().then((data) => {
              if(data.msg === 'User Not Found'){
                alert('Sender Address Not Found!');
                $('#sendMoneyModal').modal('hide');
                $("#sendAddress").val('');
                $("#sendAmount").val('');
                $('#spinner2').attr('style','display:none');
                updateWalletAmount();
              }else{
                alert(data.msg);
                $('#sendMoneyModal').modal('hide');
                $("#sendAddress").val('');
                $("#sendAmount").val('');
                $('#spinner2').attr('style','display:none');
                updateWalletAmount();
              }
            });
          }
        })
        .catch((err) => {});
    }else{
      alert('Balance Low!');
      $('#sendMoneyModal').modal('hide');
      updateWalletAmount();
    }    
  }
});

function logout() {
  localStorage.clear();
  location.href = "./index.html";
}

function updateWalletAmount(){
  fetch(instanceUrl + "/user_wallet/wallet-balance/"+localStorage.getItem('userId'), {
    method: "GET", // POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          $('#walletBalance').html('₹'+data.amount+'<br>');
        });
      }
    });
}