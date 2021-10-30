'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
	owner: 'Doyel Mishra',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2020-07-11T23:36:17.929Z',
		'2020-07-12T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account2 = {
	owner: 'Deepika Padukone',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

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
	locale: 'en-US',
};

const account3 = {
	owner: 'Rounak Dutta',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.7, // %
	pin: 3333,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2021-10-25T23:36:17.929Z',
		'2021-10-28T10:51:36.790Z',
	],
	currency: 'INR',
	locale: 'en-IN', // de-DE
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////
// FUNCTIONS
const displayMovements = function (acc, sort = false) {
	containerMovements.innerHTML = '';

	const movs = acc.movements;
	const movDates = acc.movementsDates;
	const locale = acc.locale;

	// console.log(movs, movDates, locale);

	const movements = sort ? movs.slice().sort((a, b) => a - b) : movs;

	movements.forEach(function (mov, i) {
		const movType = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movType}">
          ${i + 1}: ${movType.toUpperCase()}
        </div>
		<div class="movements__date">${getDateTime(movDates[i], locale)}</div>
        <div class="movements__value">${getCurrencyFormat(
					mov.toFixed(2),
					acc.currency,
					locale
				)}</div>
      </div>`;

		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const createUsernames = function (accs) {
	accounts.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map(name => name[0])
			.join('');
	});
};

const calcPrintBalance = function (account) {
	account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);

	labelBalance.textContent = `${getCurrencyFormat(
		account.balance.toFixed(2),
		account.currency,
		account.locale
	)}`;
};

const calcPrintSummary = function (acc) {
	const movs = acc.movements;
	const interestRate = acc.interestRate;

	const income = movs
		.filter(mov => mov > 0)
		.reduce((acc, deposit) => acc + deposit, 0);
	const expense = movs
		.filter(mov => mov < 0)
		.reduce((acc, withdr) => acc + withdr, 0);
	const interest = movs
		.filter(mov => mov > 0)
		.map(deposit => (deposit * interestRate) / 100)
		.filter(intr => intr >= 1)
		.reduce((acc, intr) => acc + intr);

	labelSumIn.textContent = getCurrencyFormat(
		income.toFixed(2),
		acc.currency,
		acc.locale
	);
	labelSumOut.textContent = getCurrencyFormat(
		Math.abs(expense).toFixed(2),
		acc.currency,
		acc.locale
	);
	labelSumInterest.textContent = getCurrencyFormat(
		interest.toFixed(2),
		acc.currency,
		acc.locale
	);
};

const updateUI = function (account) {
	// display movements
	displayMovements(account);

	// display balance
	calcPrintBalance(account);

	// display summary
	calcPrintSummary(account);
};

const getDateTime = (dateStr, locale) => {
	const calcDaysPassed = (date1, date2) =>
		Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

	const nowDate = new Date(dateStr);
	const daysPassed = calcDaysPassed(nowDate, new Date());

	if (daysPassed === 0) return 'Today';
	else if (daysPassed === 1) return 'Yesterday';
	else if (daysPassed <= 7) return `${daysPassed} days ago`;
	else return new Intl.DateTimeFormat(locale).format(nowDate);
};

const getCurrencyFormat = (num, localeCurrency, locale) => {
	const options = {
		style: 'currency',
		currency: localeCurrency,
	};

	return new Intl.NumberFormat(locale, options).format(num);
};

const startLogoutTimer = function () {
	//set time to 10 minutes
	let time = 600;

	const tick = function () {
		const minutes = `${Math.trunc(time / 60)}`.padStart(2, '0');
		const seconds = `${time % 60}`.padStart(2, '0');

		// print the remaining minutes in UI
		labelTimer.textContent = `${minutes}:${seconds}`;

		//check time is 0
		if (time === 0) {
			clearInterval(timer);
			// hide ui and display message
			labelWelcome.textContent = 'Log in to get started';
			containerApp.style.opacity = 0;
		}

		//decrese the time
		time--;
	};
	//call the timer every second
	tick();
	const timer = setInterval(tick, 1000);

	return timer;
};

///////////////////////////////////////////////
// EVENT LISTNER
/////////////////////////////////////////////////
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
	// to prevent refreshing
	e.preventDefault();

	currentAccount = accounts.find(
		acc => acc.username === inputLoginUsername.value
	);

	if (currentAccount?.pin === +inputLoginPin.value) {
		// display ui and message
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(' ')[0]
		}`;

		// start timer
		if (timer) clearInterval(timer);
		timer = startLogoutTimer();

		// display date
		const nowDate = new Date();
		const options = {
			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			weekday: 'short',
		};
		labelDate.textContent = new Intl.DateTimeFormat(
			currentAccount.locale,
			options
		).format(nowDate);

		// show UI
		containerApp.style.opacity = 100;

		// clear the input fields
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginUsername.blur();
		inputLoginPin.blur();

		// update UI
		updateUI(currentAccount);
	} else {
		// hide ui and display message
		labelWelcome.textContent = 'Wrong credentials, please try again!';
		containerApp.style.opacity = 0;
	}
});

btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = +inputTransferAmount.value;
	const receiverAccount = accounts.find(
		acc => acc.username === inputTransferTo.value
	);

	inputTransferAmount.value = inputTransferTo.value = '';
	inputTransferTo.blur();
	inputTransferAmount.blur();

	if (
		amount > 0 &&
		receiverAccount &&
		currentAccount.balance >= amount &&
		receiverAccount?.username !== currentAccount.username
	) {
		currentAccount.movements.push(-amount);
		currentAccount.movementsDates.push(new Date().toISOString());

		receiverAccount.movements.push(amount);
		receiverAccount.movementsDates.push(new Date().toISOString());

		// update UI
		updateUI(currentAccount);

		//reset the timer
		if (timer) clearInterval(timer);
		timer = startLogoutTimer();
	}
});

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Math.floor(inputLoanAmount.value);
	console.log(amount);

	inputLoanAmount.value = '';
	inputLoanAmount.blur();

	if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
		setTimeout(function () {
			currentAccount.movements.push(amount);
			currentAccount.movementsDates.push(new Date().toISOString());

			// update UI
			updateUI(currentAccount);
		}, 3000);

		//reset the timer
		if (timer) clearInterval(timer);
		timer = startLogoutTimer();
	}
});

btnClose.addEventListener('click', function (e) {
	e.preventDefault();

	const isCurrentAccName = inputCloseUsername.value === currentAccount.username;
	const isCorrectAccPIN = Number(inputClosePin.value) === currentAccount.pin;

	inputCloseUsername.value = inputClosePin.value = '';
	inputCloseUsername.blur();
	inputClosePin.blur();

	if (isCurrentAccName && isCorrectAccPIN) {
		const idx = accounts.findIndex(
			acc => acc.username === currentAccount.username
		);

		// delete account
		accounts.splice(idx, 1);

		// hide ui and display message
		labelWelcome.textContent = 'Log in to get started';
		containerApp.style.opacity = 0;
	}
});

let isSortedMovements = false;
btnSort.addEventListener('click', function (e) {
	e.preventDefault();

	displayMovements(currentAccount, !isSortedMovements);
	isSortedMovements = !isSortedMovements;
});

///////////////////////////////////////////////
// FUNCTION CALLBACKS
/////////////////////////////////////////////////

createUsernames(accounts);
