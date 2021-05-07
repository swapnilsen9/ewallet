const instanceUrl = "https://e-wallet-testing.herokuapp.com/";

console.log(process.env.PORT);

$(document).ready(doInit);

$("#saveUserSettings").click(function (evt) {
  evt.preventDefault();
  var body = {
    email: $("#emailId").val(),
    sessionUserName: sessionStorage.getItem("userName"),
    username: $("#userName").val(),
    fName: $("#firstName").val(),
    lName: $("#lastName").val(),
  };
  fetch(instanceUrl + "/user_credentials/", {
    method: "PATCH", // POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          if (data.updated === true) {
            sessionStorage.setItem("userName", data.updatedRecord.username);
            doInit();
            alert("Saved Successfully!");
          }
        });
      }
    })
    .catch((err) => {});
});

$("#saveContactSettings").click(function (evt) {
  evt.preventDefault();
  var body = {
    sessionUserName: sessionStorage.getItem("userName"),
    address : $("#address").val(),
    city : $("#city").val(),
    country : $("#country").val()
  };
  fetch(instanceUrl + "/user_credentials/", {
    method: "PATCH", // POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          if (data.updated === true) {
            doInit();
            alert("Saved Successfully!");
          }
        });
      }
    })
    .catch((err) => {});
});

function doInit() {
  let sessionUserName = sessionStorage.getItem("userName");
  if (sessionUserName === null) {
    location.href = './404.html';
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
            $("#userName").val(data.username);
            $("#emailId").val(data.email);
            $("#firstName").val(data.fName);
            $("#lastName").val(data.lName);
            $("#address").val(data.address);
            $("#city").val(data.city);
            $("#country").val(data.country);
            if(data.profileImage !== undefined){
              $("#profileImg").attr("src", instanceUrl+data.profileImage);
              $("#headerProfileImg").attr("src", instanceUrl+data.profileImage);
            }
          });
        }
      })
      .catch((err) => {});
  }
}

function logout(){
  sessionStorage.clear();
  location.href = './index.html';
}

var croppieDemo = $('#croppie-demo').croppie({
  enableOrientation: true,
  viewport: {
      width: 250,
      height: 250,
      type: 'circle' // or 'square'
  },
  boundary: {
      width: 300,
      height: 300
  }
});

$('#croppie-input').on('change', function () { 
  var reader = new FileReader();
  reader.onload = function (e) {
      croppieDemo.croppie('bind', {
          url: e.target.result
      });
  }
  reader.readAsDataURL(this.files[0]);
});

$('.croppie-upload').on('click', function (ev) {
  croppieDemo.croppie('result', {
      type: 'canvas',
      size: 'viewport'
  }).then(function (image) {
    var imageBlob = image.split(",");
    console.log(imageBlob[1]);
    var body = {
      sessionUserName: sessionStorage.getItem("userName"),
      profileImage : imageBlob[1]
    };
    fetch(instanceUrl + "/user_credentials/upload", {
      method: "PATCH", // POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            if (data.updated === true) {
              doInit();
              alert("Saved Successfully!");
              $('#modalCloseBtn').click();
            }
          });
        }
      })
      .catch((err) => {});
  });
});
