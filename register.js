// DOOM Elements
const firstName = document.querySelector("#registerFirstName");
const lastName = document.querySelector("#registerLastName");
const userName = document.querySelector("#registerUserName");
const email = document.querySelector("#registerEmail");
const password = document.querySelector("#registerPassword");
const confirmPassword = document.querySelector("#registerCPassword");
const role = document.querySelector("#registerRole");
const signInBtn = document.querySelector(".signinbtn");

// getting users data from local storage
var users = JSON.parse(localStorage.getItem("users")) || [];
var userNames = users.map((e) => {
  return e.userName;
});
let currentUser;

// Sign-In Button
signInBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Getting User data values from inputs
  let user = {
    firstName: firstName.value,
    lastName: lastName.value,
    userName: userName.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    role: role.value,
    bookedSlot :[]
  };

  // Validating Input Data
  if (!user.firstName) {
    document.querySelector(".firstnameAlert").classList.remove("hidden");
  } else if (!user.lastName) {
    document.querySelector(".firstnameAlert").classList.add("hidden");
    document.querySelector(".lastNameAlert").classList.remove("hidden");
  } else if (!user.userName) {
    document.querySelector(".lastNameAlert").classList.add("hidden");
    document.querySelector(".userNameAlert").classList.remove("hidden");
  } else if (userNames.includes(user.userName)) {
    document.querySelector(".userNameAlert").classList.add("hidden");
    document.querySelector(".userNameAlert2").classList.remove("hidden");
  } else if (!user.email) {
    document.querySelector(".userNameAlert2").classList.add("hidden");
    document.querySelector(".emailAlert").classList.remove("hidden");
  } else if (!user.password || !user.confirmPassword) {
    document.querySelector(".emailAlert").classList.add("hidden");
    document.querySelector(".passwordAlert").classList.remove("hidden");
  } else if (user.password == user.confirmPassword) {
    document.querySelector(".passwordAlert").classList.add("hidden");
    // Pushing user in Users array and storing users array in local storage
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    // storing username in array to validate unique username
    userNames.push(user.userName);

    // Storing logged in user object in currentuser
    currentUser = user;

    // Redirecting To Home Page
    var url = "home.html";
    var uname = currentUser.userName;
    url += "?username=" + encodeURIComponent(uname);
    window.location.href = url;

    // Setting Input Fields To ''
    firstName.value = "";
    lastName.value = "";
    userName.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
  } else {
    document.querySelector(".passwordAlert2").classList.remove("hidden");
  }
});
