const instanceUrl = window.location.origin;

$(function () {
  let sessionUserName = sessionStorage.getItem("userName");
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
});

$("#addMoneyBtn").click((evt) => {
  evt.preventDefault();
  $('#spinner').attr('style','');
  let sessionUserName = sessionStorage.getItem("userName");
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
            console.log(amt.toFixed(2));
            var paymentBody = {
              amount: amt.toFixed(2),
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

function logout() {
  sessionStorage.clear();
  location.href = "./index.html";
}
