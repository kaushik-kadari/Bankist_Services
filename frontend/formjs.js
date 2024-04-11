const btnRegister = document.querySelector('.btn-register');
const inputFirstName = document.querySelector('.first-name');
const inputLastName = document.querySelector('.last-name');
const inputPassword = document.querySelector('.set-password');
const conPassword = document.querySelector('.con-password');
const alertDiv = document.querySelector('.alertdiv');
const input = document.querySelectorAll('.input');

let accounts;

let getData = async () => {
  fetch('https://bankist-v4rm.onrender.com/data')
  .then(response => response.json())
  .then(data => {
    accounts = data;
    // console.log(data);
  })
  .catch(error => console.error('Error fetching data:', error));
}
getData();


async function saveandget() {
    return new Promise(res => {
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
          res();
          return response.json();
      })
      .then(responseData => {
          // Handle the response from the server
          console.log('Data updated successfully:', responseData);
      })
      .catch(error => console.error('Error updating data:', error))
    });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateAlert = (message) => {
  alertDiv.innerHTML = `<div class="alert alert-warning alert-dismissible fade show my-5 mx-auto " role="alert">
                            <p class="alert-text">${message}</p>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                          </div>`
};

btnRegister.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const newName = inputFirstName.value + " " + inputLastName.value;
    const newPin = inputPassword.value;
    const conPin = conPassword.value;
    if(newPin != conPin) {
      updateAlert("Password doesn't match!");
      return;
    } 
    if(!newName || !newPin) return;
    const newAcc = {owner: newName, pin: newPin,  movements: [1000], interestRate: 1.2};
    // console.log(newAcc);
    accounts.push(newAcc);
    input.forEach((inp) => inp.value = "");
    await saveandget();
    body2.style.opacity = 0;
    await sleep(300);
    window.location.href = "index.html";
  })