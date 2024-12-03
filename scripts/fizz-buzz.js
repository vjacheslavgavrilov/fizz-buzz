const divContent = document.querySelector('.js-content');
if (divContent) {
  divContent.innerHTML = `
    <div class="icon-view">
      <img class="emoji">
    </div>
    <div class="title-box">
      <h1>
        FizzBuzz
      </h1>
      <div class="text-box">
        <p>
          any number divisible by <span class="bold">3</span> is replaced by the word <span class="bold">Fizz</span> and any number divisible by <span class="bold">5</span> by the word <span class="bold">Buzz</span>.
        </p>
        <p>
          numbers divisible by both <span class="bold">3</span> and <span class="bold">5</span> become <span class="bold">FizzBuzz</span>.
        </p>
      </div>
    </div>
  `;
}

const divInputContent = document.querySelector('.js-input');
if (divInputContent) {
  divInputContent.innerHTML = `
    <div class="input-box">
      <input class="input js-from-input" placeholder="from">
      <span>
        —
      </span>
      <input class="input js-to-input" placeholder="to">
    </div>
    <button class="button js-result"></button>
  `;
}

const MAX_INTERVAL = 10000;
const ERROR_MESSAGES = {
  EMPTY: 'enter a value',
  NUMBERS_ONLY: 'only numbers',
  INTERVAL_EXCEEDED: `the interval can't be more than ${MAX_INTERVAL}`,
  SAME_NUMBERS: 'the numbers can\'t be the same',
  VALUE_CAN_ONLY_GO_UP: 'the value can only go up',
  TOO_LONG: 'no more than 9 symbols',
  INTEGERS_ONLY: 'integers only'
};

let errorInputs = [];

function fizzBuzz() {
  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');
  const divOutputContent = document.querySelector('.js-output');

  if (divOutputContent) {
    divOutputContent.innerHTML = '';
  }

  const isInputFromEmpty = inputFrom.value.trim() === '';
  const isInputToEmpty = inputTo.value.trim() === '';

  removeExistingError();

  if (isInputFromEmpty || isInputToEmpty) {
    showError(ERROR_MESSAGES.EMPTY);
    highlightEmptyInputs(isInputFromEmpty, isInputToEmpty);
    if (isInputFromEmpty) errorInputs.push(inputFrom);
    if (isInputToEmpty) errorInputs.push(inputTo);
    return;
  }

  const cleanedFromValue = cleanInput(inputFrom.value);
  const cleanedToValue = cleanInput(inputTo.value);

  if (cleanedFromValue.includes(',') || cleanedFromValue.includes('.') || cleanedToValue.includes(',') || cleanedToValue.includes('.')) {
    showError(ERROR_MESSAGES.INTEGERS_ONLY);
    if (cleanedFromValue.includes(',') || cleanedFromValue.includes('.')) {
      inputFrom.classList.add('input-error');
      errorInputs.push(inputFrom);
    }
    if (cleanedToValue.includes(',') || cleanedToValue.includes('.')) {
      inputTo.classList.add('input-error');
      errorInputs.push(inputTo);
    }
    return;
  }

  if (cleanedFromValue.length > 9 || cleanedToValue.length > 9) {
    showError(ERROR_MESSAGES.TOO_LONG);
    if (cleanedFromValue.length > 9) {
      inputFrom.classList.add('input-error');
      errorInputs.push(inputFrom);
    }
    if (cleanedToValue.length > 9) {
      inputTo.classList.add('input-error');
      errorInputs.push(inputTo);
    }
    return;
  }

  const fromValue = Number(cleanedFromValue);
  const toValue = Number(cleanedToValue);

  if (isNaN(fromValue) || isNaN(toValue)) {
    showError(ERROR_MESSAGES.NUMBERS_ONLY);
    highlightInvalidInputs(isNaN(fromValue), isNaN(toValue));
    if (isNaN(fromValue)) errorInputs.push(inputFrom);
    if (isNaN(toValue)) errorInputs.push(inputTo);
    return;
  }

  if (fromValue === toValue) {
    showError(ERROR_MESSAGES.SAME_NUMBERS);
    inputFrom.classList.add('input-error');
    inputTo.classList.add('input-error');
    errorInputs.push(inputFrom, inputTo);
    return;
  }

  if (toValue < fromValue) {
    showError(ERROR_MESSAGES.VALUE_CAN_ONLY_GO_UP);
    inputTo.classList.add('input-error');
    errorInputs.push(inputTo);
    return;
  }

  if (toValue - fromValue > MAX_INTERVAL) {
    showError(ERROR_MESSAGES.INTERVAL_EXCEEDED);
    errorInputs.push(inputTo);
    return;
  }

  inputFrom.classList.remove('input-error');
  inputTo.classList.remove('input-error');
  errorInputs = [];

  if (divInputContent) {
    divInputContent.innerHTML = '';
  }

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info-div');
  infoDiv.textContent = `from ${inputFrom.value} to ${inputTo.value}`;

  const resultDiv = document.createElement('div');
  resultDiv.classList.add('result-div');
  const resetDiv = document.createElement('div');
  resetDiv.classList.add('reset-div');

  const outputElements = [];
  for (let i = fromValue; i <= toValue; i++) {
    let output = '';

    if (i === 0) {
      output = '0';
    } else if (i % 3 === 0 && i % 5 === 0) {
      output = 'FizzBuzz';
    } else if (i % 3 === 0) {
      output = 'Fizz';
    } else if (i % 5 === 0) {
      output = 'Buzz';
    } else {
      output = i;
    }

    const outputDiv = document.createElement('span');
    outputDiv.classList.add('output-element');
    outputDiv.textContent = output;
    outputElements.push(outputDiv);

    if (i < toValue) {
      const commaSpan = document.createElement('span');
      commaSpan.classList.add('comma');
      commaSpan.innerHTML = ',';
      outputElements.push(commaSpan);
    }
  }

  outputElements.forEach(element => resultDiv.appendChild(element));

  const resetButton = document.createElement('button');
  resetButton.textContent = 'reset';
  resetButton.classList.add('button');
  resetButton.addEventListener('click', resetPage);
  resetDiv.appendChild(resetButton);

  if (divOutputContent) {
    divOutputContent.appendChild(infoDiv);
    divOutputContent.appendChild(resultDiv);
    divOutputContent.appendChild(resetDiv);
  }
}

function showError(message) {
  const divErrorContent = document.createElement('div');
  divErrorContent.classList.add('js-error');
  divErrorContent.textContent = message;
  divErrorContent.style.color = '#DA2626';
  document.querySelector('.input-content').appendChild(divErrorContent);
}

function removeExistingError() {
  const existingErrorDiv = document.querySelector('.js-error');
  if (existingErrorDiv) {
    existingErrorDiv.remove();
  }
}

function highlightEmptyInputs(isInputFromEmpty, isInputToEmpty) {
  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');

  inputFrom.classList.toggle('input-error', isInputFromEmpty);
  inputTo.classList.toggle('input-error', isInputToEmpty);
}

function highlightInvalidInputs(isInputFromInvalid, isInputToInvalid) {
  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');

  inputFrom.classList.toggle('input-error', isInputFromInvalid);
  inputTo.classList.toggle('input-error', isInputToInvalid);
}

function cleanInput(value) {
  return value.replace(/[ ]/g, '');
}

function setRandomButtonText() {
  const buttonResult = document.querySelector('.js-result');
  const randomText = Math.random() < 0.5 ? 'fizz it!' : 'buzz it!';
  buttonResult.textContent = randomText;
  updateImageBasedOnButtonText(randomText);
}

function updateImageBasedOnButtonText(buttonText) {
  const imgElement = divContent.querySelector('img');
  if (buttonText.includes('fizz')) {
    imgElement.src = '/data/images/fizz.png';
  } else if (buttonText.includes('buzz')) {
    imgElement.src = '/data/images/buzz.png';
  }
}

function handleInputFocus(event) {
  const input = event.target;
  if (errorInputs.includes(input)) {
    input.classList.remove('input-error');
    removeExistingError();
    errorInputs = errorInputs.filter(errInput => errInput !== input);
  }
}

function resetPage() {
  const divInputContent = document.querySelector('.js-input');
  if (divInputContent) {
    divInputContent.innerHTML = `
      <div class="input-box">
        <input class="input js-from-input" placeholder="from">
        <span>
          —
        </span>
        <input class="input js-to-input" placeholder="to">
      </div>
      <button class="button js-result"></button>
    `;
  }

  const divOutputContent = document.querySelector('.js-output');
  if (divOutputContent) {
    divOutputContent.innerHTML = '';
  }

  const buttonResult = document.querySelector('.js-result');
  buttonResult.removeEventListener('click', fizzBuzz);
  buttonResult.addEventListener('click', fizzBuzz);

  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');
  inputFrom.removeEventListener('focus', handleInputFocus);
  inputTo.removeEventListener('focus', handleInputFocus);
  inputFrom.addEventListener('focus', handleInputFocus);
  inputTo.addEventListener('focus', handleInputFocus);

  setRandomButtonText();
}

const buttonResult = document.querySelector('.js-result');
if (buttonResult) {
  buttonResult.addEventListener('click', fizzBuzz);
}

const inputFrom = document.querySelector('.js-from-input');
const inputTo = document.querySelector('.js-to-input');
if (inputFrom) {
  inputFrom.addEventListener('focus', handleInputFocus);
}
if (inputTo) {
  inputTo.addEventListener('focus', handleInputFocus);
}

setRandomButtonText();