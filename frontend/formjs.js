const btnRegister = document.querySelector('.btn-register');
const inputFirstName = document.querySelector('.first-name');
const inputLastName = document.querySelector('.last-name');
const inputPassword = document.querySelector('.set-password');

let accounts;

let getData = async () => {
  fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    accounts = data;
    console.log(data);
  })
  .catch(error => console.error('Error fetching data:', error));
}
getData();


function saveandget() {
    fetch('http://localhost:3000/updateData', {
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

btnRegister.addEventListener('click', async (e) => {
    e.preventDefault(); 
    const newName = inputFirstName.value + " " + inputLastName.value;
    const newPin = inputPassword.value;
    if(!newName || !newPin) return;
    const newAcc = {owner: newName, pin: newPin,  movements: [1000], interestRate: 1.2};
    console.log(newAcc);
    body2.style.opacity = 0;
    await sleep(300);
    accounts.push(newAcc);
    saveandget();
    window.location.href = "index.html";
  })
  