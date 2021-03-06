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
            if(data.profileImage !== undefined){
              $("#headerProfileImg").attr("src", instanceUrl+data.profileImage);
            }
          });
        }
      })
      .catch((err) => {});
  }
});

function logout() {
  localStorage.clear();
  location.href = "./index.html";
}
