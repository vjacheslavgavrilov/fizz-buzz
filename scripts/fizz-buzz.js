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
          any number divisible by&nbsp;<span class="bold">3</span>&nbsp;is replaced by&nbsp;the word <span class="bold">Fizz</span> and any number divisible by&nbsp;<span class="bold">5</span>&nbsp;by&nbsp;the word <span class="bold">Buzz</span>.
        </p>
        <p>
          numbers divisible by&nbsp;both <span class="bold">3</span>&nbsp;and <span class="bold">5</span>&nbsp;become <span class="bold">FizzBuzz</span>.
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
      <span class="dash">
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
let currentErrorMessage = null;
let divOutputContent = null;
let hasError = false;

function createOutputDiv() {
  if (!divOutputContent) {
    divOutputContent = document.createElement('div');
    divOutputContent.classList.add('content-output', 'js-output');
    document.querySelector('.grid').appendChild(divOutputContent);
  }
}

function removeOutputDiv() {
  if (divOutputContent) {
    divOutputContent.remove();
    divOutputContent = null;
  }
}

function fizzBuzz() {
  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');

  createOutputDiv();
  if (divOutputContent) {
    divOutputContent.innerHTML = '';
  }

  const isInputFromEmpty = inputFrom.value.trim() === '';
  const isInputToEmpty = inputTo.value.trim() === '';

  removeExistingError();
  removeInputErrors();

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

    const outputBox = document.createElement('div');
    outputBox.classList.add('output-box');

    const outputDiv = document.createElement('span');
    outputDiv.classList.add('output-element');
    outputDiv.textContent = output;
    outputBox.appendChild(outputDiv);

    if (i < toValue) {
      const commaSpan = document.createElement('span');
      commaSpan.classList.add('comma');
      commaSpan.innerHTML = ',';
      outputBox.appendChild(commaSpan);
    }

    resultDiv.appendChild(outputBox);
  }

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

  bindButtonEvents();
}

function showError(message) {
  currentErrorMessage = message;
  hasError = true;
  repositionErrorMessage();
}

function repositionErrorMessage() {
  removeExistingError();

  if (hasError && currentErrorMessage) {
    const divErrorContent = document.createElement('div');
    divErrorContent.classList.add('js-error');
    divErrorContent.textContent = currentErrorMessage;
    divErrorContent.style.color = '#DA2626';

    const inputBox = document.querySelector('.input-box');
    const inputContent = document.querySelector('.input-content');

    if (window.innerWidth <= 767 && inputBox) {
      inputBox.appendChild(divErrorContent);
    } else if (inputContent) {
      inputContent.appendChild(divErrorContent);
    }
  }
}

function removeExistingError() {
  const existingErrorDiv = document.querySelector('.js-error');
  if (existingErrorDiv) {
    existingErrorDiv.remove();
  }
}

function removeInputErrors() {
  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');

  if (inputFrom) {
    inputFrom.classList.remove('input-error');
  }

  if (inputTo) {
    inputTo.classList.remove('input-error');
  }
}

function highlightEmptyInputs(isInputFromEmpty, isInputToEmpty) {
  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');

  if (inputFrom) {
    inputFrom.classList.toggle('input-error', isInputFromEmpty);
  }

  if (inputTo) {
    inputTo.classList.toggle('input-error', isInputToEmpty);
  }
}

function highlightInvalidInputs(isInputFromInvalid, isInputToInvalid) {
  const inputFrom = document.querySelector('.js-from-input');
  const inputTo = document.querySelector('.js-to-input');

  if (inputFrom) {
    inputFrom.classList.toggle('input-error', isInputFromInvalid);
  }

  if (inputTo) {
    inputTo.classList.toggle('input-error', isInputToInvalid);
  }
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
        <span class="dash">
          —
        </span>
        <input class="input js-to-input" placeholder="to">
      </div>
      <button class="button js-result"></button>
    `;
  }

  removeOutputDiv();

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

  bindButtonEvents();
}

function bindButtonEvents() {
  const buttons = document.querySelectorAll('button');

  buttons.forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        button.classList.add('button-active');
      }
    });

    button.addEventListener('mouseup', () => {
      button.classList.remove('button-active');
    });

    button.addEventListener('mouseleave', () => {
      button.classList.remove('button-active');
    });

    button.addEventListener('touchstart', (event) => {
      button.classList.add('button-active');
    });

    button.addEventListener('touchend', () => {
      button.classList.remove('button-active');
    });

    button.addEventListener('touchcancel', () => {
      button.classList.remove('button-active');
    });
  });

  document.addEventListener('mouseup', () => {
    buttons.forEach((button) => {
      button.classList.remove('button-active');
    });
  });

  document.addEventListener('touchend', () => {
    buttons.forEach((button) => {
      button.classList.remove('button-active');
    });
  });

  document.addEventListener('touchcancel', () => {
    buttons.forEach((button) => {
      button.classList.remove('button-active');
    });
  });
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

window.addEventListener('resize', () => {
  hasError = false;
  removeExistingError();
  removeInputErrors();
  repositionErrorMessage();
});

setRandomButtonText();

bindButtonEvents();