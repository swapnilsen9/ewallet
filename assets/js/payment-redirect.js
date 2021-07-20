const instanceUrl = window.location.origin;
localStorage.setItem('reloadCount', 0)

$(function () {
  let sessionUserName = localStorage.getItem("userName");
  if (sessionUserName === null) {
    //location.href = "./404.html";
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
    let paramsString = window.location.search.replace("?", "");
    let searchParams = new URLSearchParams(paramsString);
    console.log(searchParams.get("status"));
    console.log(searchParams.get("msg"));
    console.log(searchParams.get("amt"));
    console.log(searchParams.get("txnid"));
    if (searchParams.get("status") == "TXN_SUCCESS") {
      fetch(instanceUrl + "/user_wallet/update-wallet/" + localStorage.getItem('userId'), {
        method: "PATCH", // POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount : searchParams.get("amt"), lastTxnId : searchParams.get("txnid") }),
      })
        .then((userResponse) => {
          if (userResponse.status == 200) {
            userResponse.json().then((userDataJson) => {
              if(userDataJson.updated === true){
                $("#paymentStatus").html(
                  "Payment of Rs. " + searchParams.get("amt") + " was Successful!"
                );
                $("#msg").html(
                  "Rs. " +
                    searchParams.get("amt") +
                    " has been added to your wallet. You can check your wallet balance on the dashboard.<br/>Click The Button Below to go to the dashboard."
                );
              }
            });
          }else if(userResponse.status == 400){
            $("#paymentStatus").html(
              "Duplicate Entry"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.setItem('reloadCount', localStorage.getItem('reloadCount') + 1);
          if(localStorage.getItem('reloadCount') <= 3){
            location.reload();
          }else{
            $("#paymentStatus").html(
              "Payment of Rs. " + searchParams.get("amt") + " has Failed!"
            );
            $("#msg").html("Failure Reason: Server Failure");
          }          
        });
    } else if (searchParams.get("status") == "TXN_FAILURE") {
      $("#paymentStatus").html(
        "Payment of Rs. " + searchParams.get("amt") + " has Failed!"
      );
      $("#msg").html("Failure Reason: " + searchParams.get("msg"));
    }
  }
});

function logout() {
  localStorage.clear();
  location.href = "./index.html";
}

function goHome(){
  localStorage.setItem('reloadCount', 0)
  window.open(instanceUrl+'/home.html', '_self');
}
