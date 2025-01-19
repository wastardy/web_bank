'use strict';

//#region  USERS
const account1 = {
    owner: 'Andrew Wastardy',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1,
    type: 'premium',

	movementsDates: [
		'2024-11-18T21:31:17.178Z',
		'2024-12-29T07:42:02.383Z',
		'2025-01-01T09:15:04.904Z',
		'2025-01-10T10:17:24.185Z',
		'2025-01-14T14:11:59.604Z',
		'2025-01-16T17:01:17.194Z',
		'2025-01-18T23:36:17.929Z',
		'2025-01-19T10:51:36.790Z',
	],
	currency: 'GBP',
	locale: 'en-GB',
};

const account2 = {
    owner: 'Mary Davis',
    movements: [5000, 3400, -150],
    interestRate: 1.5,
    pin: 2,
    type: 'standart',

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'pt-PT',
};

const account3 = {
    owner: 'Michael Towns',
    movements: [],
    interestRate: 0.7,
    pin: 3,
    type: 'basic'
};

const account4 = {
    owner: 'Sarah Talor',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4,
    type: 'standart'
};
const account5 = {
    owner: 'Brandyn Patek',
    movements: [430, 1070, 7505, -5000, 922, 5350, 9999, -3077, -1200, 6850],
    interestRate: 2.4,
    pin: 1,
    type: 'premium'
};
const account6 = {
    owner: 'John Pipe',
    movements: [1300, 6000, -1900],
    interestRate: 0.4,
    pin: 1,
    type: 'standart'
};
const account7 = {
    owner: 'Jim Jam',
    movements: [430, 1000, 712, -50, 1200, -992],
    interestRate: 1.1,
    pin: 1,
    type: 'standart'
};
//#endregion

const accounts = [
    account1, 
    account2, 
    account3, 
    account4, 
    account5, 
    account6, 
    account7
];

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

const howManyDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
}

const getDate = () => {
    const now = new Date();

    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    return `${day}/${month}/${year}, ${hour}:${minutes}`;
}

const setDate = (currentAccount) => {
    const now = new Date();
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
    }
    // you can replace 'en-GB' with locale to set your location
    // const locale = navigator.language;

    const loc = currentAccount.locale;

    labelDate.textContent = new Intl
        .DateTimeFormat(loc, options)
        .format(now);
}

const daysPassed = (date, currentAccount) => {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hour = date.getHours();
    // const minutes = date.getMinutes();

    const daysPassed = howManyDaysPassed(new Date(), date);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else return Intl.DateTimeFormat(currentAccount.locale).format(date);
    
    // return `${day}/${month}/${year}`;
}

const formatNumbersAndCurrency = (currentAccount, movement) => {
    const formattedMovement = Intl.NumberFormat(
        currentAccount.locale, 
        {
            style: 'currency', 
            currency: currentAccount.currency
        })
        .format(movement);

    return formattedMovement;
}

const displayMovements = (currentAccount, sortParam = false) => {
    containerMovements.innerHTML = '';
    const movements = currentAccount.movements;

    const combinedMovementsAndDates = currentAccount.movements
        .map((mov, i) => {
            return ({
                movement: mov, 
                movementDate: currentAccount.movementsDates.at(i)
            });
        });

    if (sortParam) combinedMovementsAndDates.sort(
            (a, b) => a.movement - b.movement);

    // const movs = sortParam 
    //     ? movements.slice().sort((a, b) => a - b) 
    //     : movements;

    combinedMovementsAndDates.forEach((object, i) => {
        const { movement, movementDate } = object;

        const type = movement > 0 ? 'deposit' : 'withdrawal';
        
        let date = new Date(movementDate);
        let editedDate = daysPassed(date, currentAccount);

        const formattedMovement = formatNumbersAndCurrency(
            currentAccount, 
            movement
        );

        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">
                    ${i + 1} ${type}
                </div>
                <div class="movements__date">
                    ${editedDate}
                </div>
                <div class="movements__value">
                    ${formattedMovement}
                </div>
            </div>
        `;

        containerMovements.insertAdjacentHTML(
            'afterbegin',
            html
        );
    });
}

const calcDisplayBalance = (currentAccount) => {
    currentAccount.balance = currentAccount.movements
        .reduce((sum, num) => {
            return sum + num;
        }, 0);

    const accountBallance = formatNumbersAndCurrency(
        currentAccount, 
        currentAccount.balance
    );

    labelBalance.textContent = `${accountBallance}`;
}

const calcIncomes = (currentAccount) => {
    const movements = currentAccount.movements;

    const incomes = movements
        .filter(mov => mov > 0)
        .reduce((sum, num) => sum + num, 0);

    const formattedIncomes = formatNumbersAndCurrency(
        currentAccount, 
        incomes
    );

    labelSumIn.textContent = `${formattedIncomes}`;
}

const calcOutcomes = (currentAccount) => {
    const movements = currentAccount.movements;

    const outcomes = movements
        .filter(mov => mov < 0)
        .reduce((sum, num) => sum + num, 0);
    
    const absoluteOutcomes = Math.abs(outcomes);

    const formattedOutcomes = formatNumbersAndCurrency(
        currentAccount, 
        absoluteOutcomes
    );

    labelSumOut.textContent = `${formattedOutcomes}`
}

const calcInterest = (currentAccount) => {
    const movements = currentAccount.movements;
    const interestRate = currentAccount.interestRate;

    const interest = movements
        .filter(mov => mov > 0)
        .map(deposit => deposit * interestRate / 100)
        .filter(interest => interest >= 1)
        .reduce((sumDeposit, num) => sumDeposit + num, 0);

    const formattedInterest = formatNumbersAndCurrency(
        currentAccount, 
        interest
    );

    labelSumInterest.textContent = `${formattedInterest}`
}

const updateUI = (currentAccount) => {
    displayMovements(currentAccount);
    calcDisplayBalance(currentAccount);
    calcIncomes(currentAccount);
    calcOutcomes(currentAccount);
    calcInterest(currentAccount); 
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

    const amount = +(inputTransferAmount.value);

    let balance = currentAccount.balance;
    console.log('ballance:', balance);

    try {
        if (amount > 0 
            && balance >= amount
            && receiverAccount?.username !== currentAccount.username
        ) {
            currentAccount.movements.push(-amount);
            receiverAccount.movements.push(amount);

            currentAccount.movementsDates.push(
                new Date().toISOString()
            );
            receiverAccount.movementsDates.push(
                new Date().toISOString()
            );

            console.log('--->', currentAccount);

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

const requestLoan = (currentAccount) => {
    try {
        const loanAmount = +(inputLoanAmount.value);

        const checkDeposit = currentAccount.movements.some(movement => {
            return movement >= loanAmount * 0.1; // any movement >= from 10% of the amount
        });

        if (loanAmount > 0 && checkDeposit) {
            currentAccount.movements.push(loanAmount);
            
            currentAccount.movementsDates.push(
                new Date().toISOString()
            );
            console.log(currentAccount.movementsDates);
            
            updateUI(currentAccount);

            alert(`Requested the amount of ${loanAmount}€`)
        }
        else {
            inputLoanAmount.value = '';
            throw new Error('loan ammount is unacceptable');
        }
    }
    catch(error) {
        alert(error.message);
        console.error(error.message);
    }
}

const closeAccount = (currentAccount) => {
    let closeUsername = inputCloseUsername.value;
    let closePassword = +(inputClosePin.value);
    let currentUsername = currentAccount.username;
    let currentPassword = currentAccount.pin;

    if (closeUsername === currentUsername
        && closePassword === currentPassword
    ) {
        const index = accounts.findIndex(account => {
            return account.username === currentUsername;
        });
        
        inputCloseUsername.value = '';
        inputClosePin.value = '';
        containerApp.style.opacity = 0;
        labelWelcome.textContent = 'Log in to get started';

        alert(`${currentAccount.owner.slice(' ')[0]}, you closed your account`)
        console.log(`${currentAccount.owner.slice(' ')[0]}, you closed your account`);

        accounts.splice(index, 1); 
    }
    else {
        alert(`incorrect username or pin`)
    }
}

const changeRowsColors = () => {
	[...document.querySelectorAll('.movements__row')]
		.forEach((row, i) => {
			if (i % 2 == 0) {
				row.style.backgroundColor = '#f7f7f7';
			}
		});
}
//#endregion

//#region CALLS
createUsername(accounts);
//#endregion

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


//#region Event Handlers
let timer;
let sortMovements = false;
let currentAccount;

// ALWAYS LOGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = '100';

document.addEventListener('DOMContentLoaded', changeRowsColors);
containerMovements.addEventListener('scroll', changeRowsColors);

btnLogin.addEventListener('click', (event) => {
    // prevent form from submitting
    event.preventDefault();

    try {
        currentAccount = accounts.find(account => {
            return account.username === inputLoginUsername.value;
        });

        setDate(currentAccount);
        // labelDate.textContent = setDate();
    
        if (!currentAccount) {
            throw new Error('incorrect username or pin')
        }
    
        if (currentAccount?.pin === +(inputLoginPin.value)) {
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

btnSort.addEventListener('click', (event) => {
    event.preventDefault();
    if (sortMovements) {
        sortMovements = false;
        displayMovements(currentAccount, sortMovements);
    }
    else {
        sortMovements = true;
        displayMovements(currentAccount, sortMovements);
    }
});

btnTransfer.addEventListener('click', (event) => {
    event.preventDefault();

    transferMoney(currentAccount);
    // console.log(currentAccount.movementsDates);
});

btnLoan.addEventListener('click', (event) => {
    event.preventDefault();

    requestLoan(currentAccount);
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

let tempNum = 0;
const latestWithdrawal = movements.findLast(number => {
    if (number < tempNum) {
         tempNum = number;
    }
    else {
         tempNum = tempNum;
    }

    return number = tempNum;
});

// console.log('Your latest withdrawal:', latestWithdrawal);

const overalBalance = accounts
    .map(acc => acc.movements)
    .flat()
    .reduce((sum, cur) => sum + cur, 0);

// console.log(overalBalance);

const groupedByActivity = Object.groupBy(accounts, account => {
    const movementCount = account.movements.length;

    if (movementCount >= 8) {
        return 'very active';
    }
    else if (movementCount >= 4) {
        return 'active';
    }
    else if (movementCount >= 1) {
        return 'moderate';
    }
    else {
        return 'inactive';
    }
});
// console.log(groupedByActivity);


const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
// console.log(groupedAccounts);

const arr = Array.from({ length: 7 }, (_, i) => (i + 1) * 1.2);
// console.log(arr);

labelBalance.addEventListener('click', (event) => {
    event.preventDefault();

    const movementsUI = Array.from(
        document.querySelectorAll('.movements__value'), 
        el => +(el.textContent.replace('€', ''))   + '£'
    );

    // console.log(movementsUI);
});

// console.log(movements);

const reverseMovements = movements
    .slice()
    .reverse();
// console.log(reverseMovements);
// console.log(movements);

// INSTEAD I CAN DO THIS:
const reverseArr = movements.toReversed(); // toReversed isnt mutate original arr
// console.log(reverseArr);
// console.log(movements);

const bankDeposit = accounts
    .flatMap(acc => acc.movements)
    .filter(mov => mov > 0)
    .reduce((sumDeposit, mov) => sumDeposit + mov, 0);
// console.log('sum of all deposits:', bankDeposit);

const sums = accounts
    .flatMap(acc => acc.movements)
    .reduce((sum, num) => {
        num > 0 
        ? (sum.deposits += num) 
        : (sum.withdrawals += num);

        return sum;
    }, 
    { 
        deposits: 0, 
        withdrawals: 0 
    });
// console.log(`deposits: ${sums.deposits}\nwithdrawals: ${sums.withdrawals}`);

let title = 'this is a nice title string';
const convertToTitle = (str) => {
    //console.log(str);

    const exceptions = 
        ['a', 'an', 'the', 'but', 'and',
        'is', 'or', 'on', 'in', 'with'];

    const capitalize = (word) => word.at(0).toUpperCase() + word.slice(1);
    
    const titleCase = title
        .toLowerCase()
        .split(' ')
        .map(word => {
            return exceptions.includes(word)
            ? word
            : capitalize(word)
        });

    //console.log(titleCase);
}

convertToTitle(title);

const randInt = (min, max) => 
	Math.floor(Math.random() * (max - min + 1)) + min;

const curDate = new Date();
console.log(curDate);

// ============================== PRACTICAL TASKS ==============================

/* TEST 1 TASKS:
1. 	Store the the average weight of a "Husky" in a variable "huskyWeight"

2. 	Find the name of the only breed that likes both "running" and "fetch" 
	("dogBothActivities" variable)

3. 	Create an array "allActivities" of all the activities of all the dog breeds

4. 	Create an array "uniqueActivities" that contains only the unique activities 
	(no activity repetitions). 
	
5. 	Many dog breeds like to swim. What other activities do these dogs like? Store all 
	the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".

6. 	Do all the breeds have an average weight of 10kg or more? Log to the console 
	whether "true" or "false".

7. 	Are there any breeds that are "active"? "Active" means that the dog has 3 or more 
	activities. Log to the console whether "true" or "false".

+. What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

const breeds = [
    {
        breed: 'German Shepherd',
        averageWeight: 32,
        activities: ['fetch', 'swimming'],
    },
    {
        breed: 'Dalmatian',
        averageWeight: 24,
        activities: ['running', 'fetch', 'agility'],
    },
    {
        breed: 'Labrador',
        averageWeight: 28,
        activities: ['swimming', 'fetch'],
    },
    {
        breed: 'Beagle',
        averageWeight: 12,
        activities: ['digging', 'fetch'],
    },
    {
        breed: 'Husky',
        averageWeight: 26,
        activities: ['running', 'agility', 'swimming'],
    },
    {
        breed: 'Bulldog',
        averageWeight: 36,
        activities: ['sleeping'],
    },
    {
        breed: 'Poodle',
        averageWeight: 18,
        activities: ['agility', 'fetch'],
    },
];

// 1
const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
// console.log('1st question:', huskyWeight);

// 2
const dogBothActivities = breeds.find(breed => {
    if (breed.activities.includes('running') 
        && breed.activities.includes('fetch')) {
    return breed.breed}
});
// console.log('2nd question:', dogBothActivities);

// 3
const allActivities = breeds
    .map(breed => breed.activities)
    .flat();
// console.log('3rd question:', allActivities);

// 4
const uniqueActivities = [...new Set(allActivities)];
// console.log('4th question:', uniqueActivities);

// 5
const swimmingAdjacent = [
    ...new Set(
        breeds
            .filter(breed => breed.activities.includes('swimming'))
            .flatMap(activity => activity.activities)
            .filter(activity => activity !== 'swimming')
    )
]
// console.log('5th question:', swimmingAdjacent);

// 6
// console.log('6th question:', breeds.every(breed => breed.averageWeight > 10));

// 7
// console.log('7th question:', breeds.some(breed => breed.activities.length >= 3));

// +
const heaviestAVGFetch = breeds
    .filter(breed => breed.activities.includes('fetch'))
    .map(breed => breed.averageWeight);
// console.log('+ question:', Math.max(...heaviestAVGFetch));

/* TEST 2 TASKS
Julia and Kate are still studying dogs. This time they are want to figure 
out if the dogs in their are eating too much or too little food.

-   Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. 
    (The result is in grams of food, and the weight needs to be in kg)

-   Eating too much means the dog's current food portion is larger than the 
    recommended portion, and eating too little is the opposite.

-   Eating an okay amount means the dog's current food portion is within a 
    range 10% above and below the recommended portion.

    =============================== TASKS ===============================
1.  Loop over the array containing dog objects, and for each dog, calculate the 
    recommended food portion (recFood) and add it to the object as a new property. 
    Do NOT create a new array, simply loop over the array 

2.  Find Sarah's dog and log to the console whether it's eating too much or too little. 

3.  Create an array containing all owners of dogs who eat too much (ownersTooMuch) and 
    an array with all owners of dogs who eat too little (ownersTooLittle).

4.  Log a string to the console for each array created in 3., like this: "Matilda and Alice 
    and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

5.  Log to the console whether there is ANY dog eating EXACTLY the amount of food that 
    is recommended (just true or false)

6.  Log to the console whether ALL of the dogs are eating an OKAY amount of food 
    (just true or false)

7.  Create an array containing the dogs that are eating an OKAY amount of food 
    (try to reuse the condition used in 6.)

8.  Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', 
    based on whether they are eating too much, too little or the exact amount of food, 
    based on the recommended food portion.

9.  Group the dogs by the number of owners they have

10. Sort the dogs array by recommended food portion in an ascending order. 
    Make sure to NOT mutate the original array!

HINT: Being within a range 10% above and below the recommended portion means: 
current > (recommended * 0.90) && current < (recommended * 1.10). Basically, 
the current portion should be between 90% and 110% of the recommended portion.

*/
// TEST DATA:
const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
    { weight: 18, curFood: 244, owners: ['Joe'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
const firstTask = dogs
    .map(dog => dog.recFood = Math.floor(dog.weight ** 0.75 * 28))
// console.log(firstTask);
// console.log(dogs);

// 2
const neededDog = dogs
    .filter(dog => dog.owners.includes('Sarah'));

// console.log(neededDog);
// console.log(`\nSarah's dog eats too ${
//     neededDog.curFood > neededDog.recFood ? 'much' : 'little'
//   }`);

// 3
const ownersTooMuch = dogs
    .filter(dog => dog.curFood > dog.recFood)
    .flatMap(dog => dog.owners);

const ownersTooLittle = dogs
    .filter(dog => dog.curFood < dog.recFood)
    .flatMap(dog => dog.owners);

// 4
// console.log(`\n${ownersTooMuch.join('\'s and ')}\'s dogs eat too much`);
// console.log(`${ownersTooLittle.join('\'s and ')}\'s dogs eat too little`);

// 5
const isThereDog = dogs
  	.some(dog => dog.curFood === dog.recFood);

// console.log(`\nIs htere ANY dog eating EXACTLY the amount 
	// of food that is recommended: ${isThereDog}`);

// 6
const checkEatingOkay = dog =>
	dog.curFood < dog.recFood * 1.1 
	&& dog.curFood > dog.recFood * 0.9;

// console.log(`\nWhether ALL of the dogs are eating an OKAY 
	// amount of food: ${dogs.every(checkEatingOkay)}`);

// 7
const dogsEatingOkay = dogs.filter(checkEatingOkay);
// console.log('\nDogs, who eating okay:', dogsEatingOkay);

// 8
const groupDogsByEating = Object.groupBy(dogs, dog => {
	if (dog.curFood > dog.recFood) {
		return 'too-much';
	}
	else if (dog.curFood === dog.recFood) {
		return 'exact';
	}
	else {
		return 'too-little';
	}
});
// console.log(groupDogsByEating);

// 9
const groupDogsByOwners = Object.groupBy(dogs, dog => 
	`${dog.owners.length} - owners`
);
// console.log(groupDogsByOwners);

// 10
const sortDogs = dogs.toSorted((a, b) => a.recFood - b.recFood);
// console.log(`\nSorted dogs by recommended food:\n`, sortDogs);
//#endregion