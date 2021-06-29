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
    let paramsString = window.location.search.replace("?", "");
    let searchParams = new URLSearchParams(paramsString);
    console.log(searchParams.get("status"));
    console.log(searchParams.get("msg"));
    console.log(searchParams.get("amt"));
    if (searchParams.get("status") == "TXN_SUCCESS") {
      $("#paymentStatus").html(
        "Payment of Rs. " + searchParams.get("amt") + " was Successful!"
      );
      $("#msg").html(
        "Rs. " +
          searchParams.get("amt") +
          " has been added to your wallet. You can check your wallet balance on the dashboard.<br/>Click The Button Below to go to the dashboard."
      );
    } else if (searchParams.get("status") == "TXN_FAILURE") {
      $("#paymentStatus").html(
        "Payment of Rs. " + searchParams.get("amt") + " has Failed!"
      );
      $("#msg").html("Failure Reason: " + searchParams.get("msg"));
    }
  }
});

function logout() {
  sessionStorage.clear();
  location.href = "./index.html";
}

function goHome(){
  window.open(instanceUrl+'/home.html', '_self');
}
