// Elements
const body2 = document.getElementById('body2');
const body1 = document.getElementById('body1');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelMsg = document.querySelector('.msg');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnCA = document.querySelector('.signup');
const btnRegister = document.querySelector('.btn-register');
const btnLogout = document.querySelector('.logout');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputFirstName = document.querySelector('.first-name');
const inputLastName = document.querySelector('.last-name');
const inputPassword = document.querySelector('.set-password');

const alertDiv = document.querySelector('.alertdiv');

/////////////////////////////////////////////////
// Functions

let accounts;

let getData = async () => {
  fetch('https://bankist-v4rm.onrender.com/data')
  .then(response => response.json())
  .then(data => {
    accounts = data;
    // console.log(data);
    accounts = accounts.filter((acc) => !isDummy(acc));
    createUsernames(accounts);
  })
  .catch(error => console.error('Error fetching data:', error));
}
getData();


// saveArrayToLocalStorage("Accounts", arr);

// let accounts = getArrayFromLocalStorage("Accounts");
// console.log(accounts);

// //Function to get the array from local storage
// function getArrayFromLocalStorage(key) {
//   const storedData = localStorage.getItem(key);
//   return storedData ? JSON.parse(storedData) : [];
// }

// // Function to save the array to local storage
// function saveArrayToLocalStorage(key, array) {
//   localStorage.setItem(key, JSON.stringify(array));
// }

// function saveandget() {
//   saveArrayToLocalStorage("Accounts", accounts);
//   accounts = getArrayFromLocalStorage("Accounts");
// }

function saveandget() {
  fetch('https://bankist-v4rm.onrender.com/updateData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(accounts)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to update data');
      }
      return response.json();
  })
  .then(responseData => {
      // Handle the response from the server
      console.log('Data updated successfully:', responseData);
  })
  .catch(error => console.error('Error updating data:', error))
}

function deleteAccount(acc) {
  fetch('https://bankist-v4rm.onrender.com/delete', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(acc)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log('Delete request successful:', data);
  })
  .catch(error => {
      console.error('Error:', error);
  });
}


function isDummy(obj) {
  // Assuming accounts is a global variable
  return obj.owner.trim() === '';
}

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}₹</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}₹`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₹`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₹`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (Math.trunc(deposit * acc.interestRate) / 100))
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
};

const createUsernames = async function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
  // console.log(accs);
};

const startLogoutTimer = () => {
  let time = 300;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);

    labelTimer.textContent = `${min}:${sec}`;

    if(time === 0) {
      clearInterval(timer);
      labelMsg.innerHTML = `<p class="welcome">Log in to get started / <span class="signup">Create Account</span></p>`;
      containerApp.style.opacity = 0;
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const updateAlert = (message) => {
  alertDiv.innerHTML = `<div class="alert alert-warning alert-dismissible fade show my-5 mx-auto " role="alert">
                            <p class="alert-text">${message}</p>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                          </div>`
}

const calcDisplayDate = () => {
  let date = new Date().getDate();
  let year = new Date().getFullYear();
  let Month = new Date().getMonth() + 1;
  labelDate.textContent = `${date}/${Month}/${year}`;
}
calcDisplayDate();

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin == inputLoginPin.value) {
    // Display UI and message
    labelMsg.innerHTML = `<p class="welcome"> Welcome back, ${
      currentAccount.owner.split(' ')[0]
    } </p>`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if(timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
  else {
    updateAlert('Please check your login credentials');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    saveandget();
    // store_db();
    // load_db();

    if(timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
  else {
    updateAlert(`<strong> Hey ${currentAccount.owner.split(' ')[0]}!</strong> Please check your transfer details.`);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    saveandget();
    // store_db();
    // load_db();

    if(timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
  else {
    updateAlert(`<strong> Hey ${currentAccount.owner.split(' ')[0]}!</strong> Please request lesser amount.`);
  }

  inputLoanAmount.value = '';
});

btnLogout.addEventListener('click', () => {
  labelMsg.innerHTML = `<p class="welcome">Log in to get started / <span class="signup">Create Account</span></p>`;
  containerApp.style.opacity = 0;
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // const index = accounts.findIndex(
    //   acc => acc.username === currentAccount.username
    // );
    // console.log(index);
    // // .indexOf(23)

    // // Delete account
    // accounts.splice(index, 1);
    // saveandget();

    //Delete account
    deleteAccount(currentAccount);

    // Hide UI
    containerApp.style.opacity = 0;
    sleep(500);

    labelMsg.innerHTML = `<p class="welcome">Log in to get started / <span class="signup">Create Account</span></p>`;
  }
  else {
    updateAlert(`<strong>Hey ${currentAccount.owner.split(' ')[0]}!</strong> Please check your account credentials.`);
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  saveandget();
  // store_db();
  // load_db();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

btnCA.addEventListener('click', async (e) => {
  e.preventDefault();
  body1.style.opacity = 0;
  await sleep(500);
  window.location.href = "form.html";
});