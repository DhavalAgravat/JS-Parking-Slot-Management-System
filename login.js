// DOM Elements
const username = document.querySelector("#loginUserName");
const password = document.querySelector("#loginPassword");
const submitBtn = document.querySelector(".btnsignin");
const cancelBtn = document.querySelector(".cancelbtn");

// getting users,usernames from array
var users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser;
var userNames = users.map((e) => {
  return e.userName;
});

// Submit Button
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Validating Inputs
  if (username.value && password.value) {
    //  Validating Username
    if (!userNames.includes(username.value)) {
      document.querySelector(".logInAlert").classList.remove("hidden");
    } else {
      // Validating Password
      currentUser =
        users.find(function (user) {
          return user.userName === username.value;
        }) || {};

      if (currentUser?.password == password.value) {
        // Redirecting To Homepage
        var url = "home.html";
        var uname = currentUser.userName;
        url += "?username=" + encodeURIComponent(uname);
        window.location.href = url;
      } else {
        document
          .querySelector(".logInPasswordAlert")
          .classList.remove("hidden");
      }
    }
  } else {
    document.querySelector(".logInEmptyAlert").classList.remove("hidden");
  }

  // Timer For Alert
  document.querySelectorAll(".alert").forEach(function ($el) {
    setTimeout(() => {
      $el.classList.add("hidden");
    }, 2000);
  });
});

// cancel btn redirecting to register page
cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href ="register.html";
});
