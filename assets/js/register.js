const instanceUrl = "https://e-wallet-testing.herokuapp.com/";

$(function () {
  $("form[name='userForm']").validate({
    rules: {
      first_name: "required",
      last_name: "required",
      username: "required",
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 5,
      },
      password_repeat: {
        required: true,
        minlength: 5,
        equalTo: "#PasswordInput",
      },
    },
    messages: {
      first_name: "Please enter your firstname",
      last_name: "Please enter your lastname",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
      },
      password_repeat: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
        equalTo: "Repeat Password & Password Don't Match",
      },
      email: "Please enter a valid email address",
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      var userData = $(".user").serializeArray();
      registerUser(userData);
    },
  });
});

function registerUser(userData) {
  console.log(userData);
  var userObj = {
    username: userData[2].value,
    password: userData[4].value,
    email: userData[3].value,
    fName: userData[0].value,
    lName: userData[1].value,
  };
  console.log(userObj);
  fetch(instanceUrl + "/user_credentials", {
    method: "POST", // POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  })
    .then((response) => {
      if (response.status == 201) {
        response.json().then((data) => {
          if (data.success === true) {
            location.href = "./index.html";
          }
        });
      } else {
        console.log(response.status);
        response.json().then((data) => {
          console.log(data);
          if (data.success === false) {
            alert("User Name or Email Already Exists.");
            $(".user").trigger("reset");
          }
        });
      }
    })
    .catch((err) => {
      alert("Fetch Failed");
    });
}
