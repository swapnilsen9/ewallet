const instanceUrl = "https://e-wallet-testing.herokuapp.com";

$(function () {
  $("form[name='userForm']").validate({
    rules: {
      email: {
        required: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      password: {
        required: "Please provide a password",
      },
      email: {
        required: "Please provide a Email / User Name",
      },
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      var userData = $(".user").serializeArray();
      loginUser(userData);
    },
  });
});

function loginUser(userData) {
  console.log(userData);
  var userObj = {
    username: userData[0].value,
    password: userData[1].value,
  };
  fetch(instanceUrl + "/user_credentials/authenticate", {
    method: "POST", // POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  })
    .then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          if (data.success === true) {
            sessionStorage.setItem('userName', userData[0].value);
            location.href = "./home.html";
          }
        });
      } else {
        console.log(response.status);
        response.json().then((data) => {
          console.log(data);
          if (data.message === "Unauthorized") {
            alert("Unauthorized User");
            $(".user").trigger("reset");
          }
        });
      }
    })
    .catch((err) => {
      alert("Fetch Failed");
    });
}
