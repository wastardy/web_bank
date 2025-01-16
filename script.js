'use strict';

//#region  USERS
const account1 = {
    owner: 'Andrew Wastardy',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1,
};

const account2 = {
    owner: 'Mary Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2,
};

const account3 = {
    owner: 'Michael Towns',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3,
};

const account4 = {
    owner: 'Sarah Talor',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4,
};
//#endregion

const accounts = [account1, account2, account3, account4];

//#region QUERY SELECTORS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerCloseAccount = document.querySelector('.operation--close');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnCloseCover = document.querySelector('.operation--close-cover');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
//#endregion

//#region METHODS
const createUsername = function(accounts) {
    accounts.forEach(acc => {
        acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0))
        .join('');
    });
}

const displayMovements = function(movements) {
    containerMovements.innerHTML = '';

    movements.forEach(function(movement, i) {
        const type = movement > 0 ? 'deposit' : 'withdrawal';

        // <div class="movements__date">3 days ago</div>
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">
                    ${i + 1} ${type}
                </div>
                <div class="movements__value">
                    ${movement}€
                </div>
            </div>
        `;

        containerMovements.insertAdjacentHTML(
            'afterbegin',
            html
        );
    });
}

const calcDisplayBalance = function(account) {
    account.balance = account.movements.reduce((sum, num) => {
        return sum + num;
    }, 0);

    labelBalance.textContent = `${account.balance}€`;
}

const calcIncomes = function(movements) {
    const incomes = movements
        .filter(mov => mov > 0)
        .reduce((sum, num) => sum + num, 0);

    labelSumIn.textContent = `${incomes}€`;
}

const calcOutcomes = function(movements) {
    const outcomes = movements
        .filter(mov => mov < 0)
        .reduce((sum, num) => sum + num, 0);

    labelSumOut.textContent = `${Math.abs(outcomes)}€`
}

const calcInterest = function(movements, interestRate) {
    const interest = movements
        .filter(mov => mov > 0)
        .map(deposit => deposit * interestRate / 100)
        .filter(interest => interest >= 1)
        .reduce((sumDeposit, num) => sumDeposit + num, 0);

    labelSumInterest.textContent = `${Math.round(interest)}€`
}

const updateUI = (currentAccount) => {
    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount);
    calcIncomes(currentAccount.movements);
    calcOutcomes(currentAccount.movements);
    calcInterest(
        currentAccount.movements, 
        currentAccount.interestRate
    ); 
}

const login = (currentAccount) => {
    labelWelcome.textContent = 
        `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 1;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    inputLoginPin.blur();

    updateUI(currentAccount);
}

const errorWhileLogin = () => {
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
}

const transferMoney = (currentAccount) => {
    const receiverAccount = accounts.find(acc => 
        acc.username === inputTransferTo.value
    );

    const amount = Number(inputTransferAmount.value);

    let balance = currentAccount.balance;
    console.log('ballance:', balance);

    try {
        if (amount > 0 
            && balance >= amount
            && receiverAccount?.username !== currentAccount.username
        ) {
            currentAccount.movements.push(-amount);
            receiverAccount.movements.push(amount);

            updateUI(currentAccount);

            alert(
                `successfully transfered ${amount} € to ${receiverAccount.owner}`
            );

            console.log(
                'successfully transfered', 
                amount + '€ to ' + receiverAccount.owner
            );
        }
        else if (amount <= 0) {
            throw new Error(
                'you can not transfer negative amount of money'
            );
        }
        else if (balance < amount) {
            throw new Error(
                'you have less balance, than needed for current transfer'
            );
        }
        else if (receiverAccount.username === currentAccount.username) {
            throw new Error(
                'you can not transfer money to yourself'
            );
        }
        else {
            throw new Error('something went wrong..');
        }
    }
    catch (error) {
        console.error('transfering error:', error.message);
    }

    inputTransferAmount.value = '';
    inputTransferTo.value = '';
}


//#endregion

//#region CALLS
createUsername(accounts);
/* displayMovements(account1.movements);
calcDisplayBalance(account1.movements);
calcIncomes(account1.movements);
calcOutcomes(account1.movements);
calcInterest(account1.movements); */
//#endregion

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


//#region Event Handlers
let timer;
let currentAccount;

btnLogin.addEventListener('click', (event) => {
    // prevent form from submitting
    event.preventDefault();

    try {
        currentAccount = accounts.find(account => {
            return account.username === inputLoginUsername.value;
        });
    
        if (!currentAccount) {
            throw new Error('incorrect username or pin')
        }
    
        if (currentAccount?.pin === Number(inputLoginPin.value)) {
            login(currentAccount);
        }
        else {
            throw new Error('incorrect username or pin')
        }
    }
    catch (error) {
        errorWhileLogin();
        alert(`Login failed: ${error.message}`);
        console.error(`Login failed: ${error.message}`);
    }
});

btnTransfer.addEventListener('click', (event) => {
    event.preventDefault();

    transferMoney(currentAccount);
});

const restoreCover = () => {
    btnCloseCover.style.display = 'flex';
    containerCloseAccount.style.display = 'none';
    containerCloseAccount.style.opacity = '0';
}

btnCloseCover.addEventListener('click', (event) => {
    event.stopPropagation();
    btnCloseCover.style.display = 'none';

    containerCloseAccount.style.display = 'flex';
    containerCloseAccount.style.opacity = '1';
    timer = setTimeout(restoreCover, 60000);
});

document.addEventListener('click', (event) => {
    if (!containerCloseAccount.contains(event.target)) {
        restoreCover();
    }
});

containerCloseAccount.addEventListener('click', (event) => {
    event.stopPropagation();
});

btnClose.addEventListener('click', (event) => {
    event.preventDefault();

    closeAccount(currentAccount);
});
//#endregion


//#region testing stuff
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;
const totalDepositUSD = movements
    .filter(mov => mov > 0)
    .map(mov => mov * euroToUsd)
    .reduce((acc, cur) => acc + cur, 0);

// console.log(totalDepositUSD);


const deposit = movements.filter(movement => {
    return movement > 0;
});

const withdrawals = movements.filter(movement => {
    return movement < 0;
});

const maxValue = movements.reduce((acc, cur) => {
    if (cur > acc) acc = cur;

    return acc;
}, 0);

let neadedAcc = '';

for (let acc of accounts) {
    if (acc.owner === 'Michael Towns') neadedAcc = acc;
}

// console.log(neadedAcc);
//#endregion