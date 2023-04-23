// DOM elements
const welcomeText = document.querySelector(".text");
const logOutBtn = document.querySelector(".logoutbtn");
const saveBtn = document.querySelector(".saveBtn");
const inputAddress = document.querySelector("#inputAddress");
const inputSlotNumber = document.querySelector("#inputSlotNumber");
const addressAlert = document.querySelector(".addressAlert");
const sameAddressAlert = document.querySelector(".sameAddressAlert");
const emptySlotAlert = document.querySelector(".emptySlotAlert");
const negativeSlotAlert = document.querySelector(".negativeSlotAlert");
const mainContainer = document.querySelector(".row-box");
const slotBody = document.querySelector(".slotBody");
const bookBtn = document.querySelector(".bookBtn");

// current User
const urlParams = new URL(window.location.toLocaleString()).searchParams;
const username = urlParams.get("username");

// getting users array
let users = JSON.parse(localStorage.getItem("users")) || [];
let slots = JSON.parse(localStorage.getItem("slots")) || [];
let addresses = slots.map((e) => {
  return e.address.toLowerCase();
});

let id = (slots[slots.length - 1]?.id) + 1 || 1;

// logged in user - Currentuser
let currentUser = users.find(function (user) {
  return user.userName === username;
});

//Displaying Weelcome Message
welcomeText.textContent = `Welcome To Home Page ${currentUser.firstName} ${currentUser.lastName}`;

// Printing Slots
slots.map((element, i) => {
  let html = `
    <div class="col-3 mt-3">
      <div class="card " style="width: 24rem;">
        <div class="card-body">
          <p class="card-text d-none">${i}</p>
          <p class="card-text">Address : ${element.address}</p>
          <p class="card-text">Slots : <b>${element.slotsValue.length}</b></p>
          <button type="button" class="btn btn-primary viewBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
             View
            </button>
            <button type="button" class="btn btn-danger float-end deleteBtn" data-bs-toggle="modal" data-bs-target="#deleteModal"> Delete </button>
        </div>
      </div>
    </div> `;

  document.querySelector(".row-box").insertAdjacentHTML("beforeend", html);
});

const deleteBtn = document.querySelectorAll(".deleteBtn");

// if admin
if (currentUser.role === "Admin") {
  // Making delete button visible
  bookBtn.classList.add("hidden");
  document.querySelector(".createBookSlots").classList.remove("hidden");

  deleteBtn.forEach((e) => {
    e.classList.remove("hidden");
  });

  // clearing previous error messages 
  document.querySelector(".createBookSlots").addEventListener("click", () => {
    addressAlert.classList.add("hidden");
    emptySlotAlert.classList.add("hidden");
    negativeSlotAlert.classList.add("hidden");
    sameAddressAlert.classList.add("hidden");
  });

  // save btn click event
  saveBtn.addEventListener("click", () => {
    //taking input
    let slotnum = inputSlotNumber.value;
    let slot = {
      id: id,
      address: inputAddress.value,
      slotsValue: [],
      bookedslots: [],
      users: [],
    };

    // valildating input
    if (!inputAddress.value) {
      addressAlert.classList.remove("hidden");
      emptySlotAlert.classList.add("hidden");
      negativeSlotAlert.classList.add("hidden");
    } else if (
      slots.map((e) => { return e.address.toLowerCase();}).
      includes(inputAddress.value.toLowerCase())
    ) {
      sameAddressAlert.classList.remove("hidden");
      addressAlert.classList.add("hidden");
      emptySlotAlert.classList.add("hidden");
      negativeSlotAlert.classList.add("hidden");
    } else if (!inputSlotNumber.value) {
      addressAlert.classList.add("hidden");
      sameAddressAlert.classList.add("hidden");
      emptySlotAlert.classList.remove("hidden");
      negativeSlotAlert.classList.add("hidden");
    } else if (inputSlotNumber.value < 1 || inputSlotNumber.value > 11) {
      addressAlert.classList.add("hidden");
      sameAddressAlert.classList.add("hidden");
      emptySlotAlert.classList.add("hidden");
      negativeSlotAlert.classList.remove("hidden");
    } else {
      // setting slot object and adding it to slots araay
      for (let i = 1; i <= slotnum; i++) {
        slot.slotsValue.push(i);
        slot.bookedslots.push(false);
        slot.users.push("");
      }

      slots.push(slot);
      localStorage.setItem("slots", JSON.stringify(slots));

      // setting field values to default
      inputAddress.value = "";
      inputSlotNumber.value = "1";

      // adding new slot to ui
      let html = `
      <div class="col-3 mt-3">
        <div class="card" style="width: 24rem;">
          <div class="card-body">
            <p class="card-text d-none">${slot.id}</p>
            <p class="card-text">Address : ${slot.address}</p>
            <p class="card-text">Slots: <b>${slot.slotsValue.length}</b></p>

            <button type="button" class="btn btn-primary viewBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
            View
            </button>

            <button type="button" class="btn btn-danger float-end deleteBtn" data-bs-toggle="modal" data-bs-target="#deleteModal"> Delete </button>
          </div>
        </div>
      </div> `;

      document.querySelector(".row-box").insertAdjacentHTML("beforeend", html);

      // closing model on submit
      const modal = document.querySelector("#staticBackdrop");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      id++;
    }
  });

  mainContainer.addEventListener("click", (e) => {
    // Delete Button to Delete Cards
    if (e.target.classList.contains("deleteBtn")) {
      let id = e.target.parentElement.firstElementChild.innerText;
      let col = e.target.parentElement.parentElement.parentElement;

          document .querySelector(".conformDeleteBtn").addEventListener("click", () => {
          slots.splice(id, 1);
          mainContainer.removeChild(col);
          localStorage.setItem("slots", JSON.stringify(slots));

          // clossing  modal on delete
          const modal = document.querySelector("#deleteModal");
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
        });
    }
  });

  document.addEventListener("keypress", (event) => {
    let keyCode = event.keyCode ? event.keyCode : event.which;
    if (keyCode === 13) {
      mainContainer.click();
      document.querySelector(".conformDeleteBtn").click();
      saveBtn.click();
    }
  });
}

let currentSlot;
mainContainer.addEventListener("click", (e) => {
  // view button to view cards
  if (e.target.classList.contains("viewBtn")) {
    currentSlot = e.target.parentElement.firstElementChild.innerText;
    let slotNumber = e.target.parentElement.firstElementChild.nextElementSibling
                    .nextElementSibling.firstElementChild.innerText;

    let btnHtml = "";
    for (let i = 1; i <= slotNumber; i++) {
      btnHtml += `<button class="btn1 border mx-1 white">${i}</button>`;
    }
    slotBody.innerHTML = btnHtml;

    let btnArray = Array.from(slotBody.childNodes);
    // showcasing booked slots
    for (let i = 0; i < slots[currentSlot].bookedslots.length; i++) {
      // showcasing booked slots by another users
      if (slots[currentSlot].bookedslots[i] == true) {
        btnArray[i].style.backgroundColor = "red";
        btnArray[i].disabled = true;

        // showcasing booked slots by current user
        if (slots[currentSlot].users[i] === currentUser.userName) {
          btnArray[i].style.backgroundColor = "green";
          btnArray[i].disabled = true;
        }
      }
    }
  }
});

//If User
if (currentUser.role === "User") {
  // Making book btn visible and hiding delete btn
  bookBtn.classList.remove("hidden");
  deleteBtn.forEach((e) => {  e.classList.add("hidden"); });

  // toggling color on unbooked slots
  slotBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("green")) {
      e.target.classList.remove("green");
      e.target.classList.add("white");
    } else if (e.target.classList.contains("white")) {
      e.target.classList.add("green");
      e.target.classList.remove("white");
    }
  });

  // book btn event listener
  document.querySelector(".bookBtn").addEventListener("click", (e) => {
    // slecting all slots
    let btngrp = Array.from(e.target.parentElement.previousElementSibling.previousElementSibling.childNodes);

    let slectedSlots = btngrp.filter((e, i) => {
      return e.classList.contains("green");
    });

    if (slectedSlots.length === 0) {
      alert("Please Select A Slot First");
    } else if (slectedSlots.length > 0) {
      slectedSlots.forEach((e) => {
        e.classList.add("green");
        e.disabled = true;
        e.classList.remove("white");

        let currentIndex = e.innerHTML - 1;

        // changing booked valuue to true and passing username
        slots[currentSlot].bookedslots[currentIndex] = true;
        slots[currentSlot].users[currentIndex] = currentUser.userName;
        localStorage.setItem("slots", JSON.stringify(slots));
      });
    }

    // closing model on submit
    const modal = document.querySelector("#staticBackdrop2");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  });
}

// Log Out Btn redirecting To Register page
logOutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "register.html";
});
