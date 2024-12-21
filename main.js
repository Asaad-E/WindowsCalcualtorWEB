// Get HTML element

const calculatorPrevious = document.getElementsByClassName(
  "calculator__previous"
)[0];
const calculatorCurrent = document.getElementsByClassName(
  "calculator__current"
)[0];

const calculatorButtons = document.getElementsByClassName(
  "calculator__buttons"
)[0];

const recordSection = document.getElementsByClassName("record")[0];
const recordContainer = document.getElementsByClassName("record_container")[0];
const recordClear = document.getElementsByClassName("record__clear")[0];
const recordActive = document.getElementsByClassName(
  "calculator_record-icon"
)[0];

// Parameters and constans

const MAXLENGTH = 8;
let lastOperation = "";
let lastAction = "0";
let lastResult = 0;
let viewToClear = false;

const SYMBOLS = {
  plus: "+",
  times: "*",
  division: "/",
  minus: "-",
};

// Functions

function clampNumber(number) {
  if (String(number).length > MAXLENGTH) {
    return Number(String(number).slice(0, MAXLENGTH));
  } else {
    return Number(number);
  }
}

function getCurrentNumber() {
  return Number(calculatorCurrent.textContent);
}

function addNumber(number) {
  console.log(lastAction);

  if (viewToClear) {
    calculatorCurrent.textContent = "0";
  }

  if (calculatorCurrent.textContent.length > MAXLENGTH) return;

  if (number === 0) {
    if (calculatorCurrent.textContent !== "0")
      calculatorCurrent.textContent += number;
  } else {
    if (calculatorCurrent.textContent !== "0") {
      calculatorCurrent.textContent += number;
    } else {
      calculatorCurrent.textContent = number;
    }
  }

  viewToClear = false;
}

function addDot() {
  if (!calculatorCurrent.textContent.includes(".")) {
    calculatorCurrent.textContent += ".";
  }
}

function negate() {
  if (calculatorCurrent.textContent === "0") return;

  if (calculatorCurrent.textContent.includes("-")) {
    calculatorCurrent.textContent = calculatorCurrent.textContent.substring(1);
  } else {
    calculatorCurrent.textContent = "-" + calculatorCurrent.textContent;
  }
}

function reciprocal() {
  const number = getCurrentNumber();

  if (number === 0) return;

  const result = 1 / number;

  calculatorPrevious.textContent = `1/(${calculatorCurrent.textContent})`;
  calculatorCurrent.textContent = result;
  viewToClear = true;
}

function square() {
  const number = getCurrentNumber();

  if (number === 0) return;

  const result = number ** 2;

  calculatorPrevious.textContent = `(${calculatorCurrent.textContent})^2`;
  calculatorCurrent.textContent = result;
  viewToClear = true;
}

function rootSquare() {
  const number = getCurrentNumber();

  if (number === 0) return;

  const result = number ** 0.5;

  calculatorPrevious.textContent = `(${calculatorCurrent.textContent})^0.5`;
  calculatorCurrent.textContent = result;
  viewToClear = true;
}

function addOperation(id) {
  checkOperationChain();

  if (calculatorCurrent.textContent === "Infinity") return;

  calculatorPrevious.textContent = `${calculatorCurrent.textContent} ${SYMBOLS[id]} `;
  lastOperation = id;
  processing = true;
  viewToClear = true;
}

function checkOperationChain() {
  if (
    calculatorPrevious.textContent.split(" ").length === 3 &&
    viewToClear === false
  ) {
    calculateResult();
    addRecord();
  }
}

function processResult(number1, number2) {
  return clampNumber(eval(`${number1}${SYMBOLS[lastOperation]}${number2}`));
}

function calculateResult() {
  if (calculatorPrevious.textContent.split(" ").length < 3) return;

  let number1 = calculatorPrevious.textContent.split(" ")[0];
  let number2 = calculatorCurrent.textContent;

  if (lastAction === "equal") {
    number1 = calculatorCurrent.textContent;
    number2 = calculatorPrevious.textContent.split(" ")[2];
  }

  const result = processResult(number1, number2);

  calculatorCurrent.textContent = result;
  calculatorPrevious.textContent = `${number1} ${SYMBOLS[lastOperation]} ${number2}`;

  if (!isFinite(result)) {
    lastResult = 0;
    viewToClear = true;
    calculatorPrevious.textContent = ``;
  } else {
    lastResult = Number(result);
    viewToClear = true;
    return result;
  }
}

function deleteLastNumber() {
  if (calculatorCurrent.textContent === "0") return;

  if (calculatorCurrent.textContent.length === 1) {
    calculatorCurrent.textContent = "0";
  } else {
    calculatorCurrent.textContent = calculatorCurrent.textContent.substring(1);
  }
}

function clearView(id) {
  if (id === "C" || calculatorPrevious.textContent.split(" ")[2] !== "") {
    calculatorPrevious.textContent = "";
    calculatorCurrent.textContent = "0";
  } else {
    calculatorCurrent.textContent = "0";
  }
}

function addRecord() {
  const previous = calculatorPrevious.textContent;
  const current = calculatorCurrent.textContent;

  const record = document.createElement("div");
  record.classList.add("record_log");

  const previousElement = document.createElement("p");
  previousElement.classList.add("record__previous");
  previousElement.textContent = previous;

  const currentElement = document.createElement("p");
  currentElement.classList.add("record__current");
  currentElement.textContent = current;

  record.appendChild(previousElement);
  record.appendChild(currentElement);

  record.addEventListener("click", getDataFromRecord);

  recordContainer.prepend(record);
  setTimeout(() => {
    record.classList.toggle("record--fadein");
  }, 1);
}

function manageClickButtons(id) {
  switch (id) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      addNumber(parseInt(id));
      break;
    case "dot":
      addDot();
      break;
    case "negate":
      negate();
      addRecord();
      break;
    case "reciprocal":
      reciprocal();
      addRecord();
      break;
    case "square":
      square();
      addRecord();
      break;
    case "rootSquare":
      rootSquare();
      addRecord();
      break;
    case "CE":
    case "C":
      clearView(id);
      break;
    case "minus":
    case "plus":
    case "division":
    case "times":
      addOperation(id);
      break;
    case "delete":
      deleteLastNumber();
      break;
    case "equal":
      calculateResult();
      addRecord();
      break;
    default:
      break;
  }

  lastAction = id;
}

function getDataFromRecord(e) {
  let record;

  if (e.target.classList.contains("record_log")) {
    record = e.target;
  } else {
    record = e.target.parentElement;
  }

  let children = record.children;

  let previous = children[0].textContent;
  let current = children[1].textContent;

  calculatorPrevious.textContent = previous;
  calculatorCurrent.textContent = current;

  lastOperation = "";
  lastAction = "";
  lastResult = getCurrentNumber();

  if (recordSection.classList.contains("record--active")) {
    recordSection.classList.toggle("record--active");
  }
}

function clearRecord() {
  recordContainer.innerHTML = "";
}

function activeRecordMobile(e) {
  recordSection.classList.toggle("record--active");
}

function recordMobileHandler(e) {
  if (!recordSection.classList.contains("record--active")) return;

  if (
    e.target.classList.contains("record_log") ||
    e.target.classList.contains("record__previous") ||
    e.target.classList.contains("record__current")
  ) {
  } else {
    recordSection.classList.toggle("record--active");
  }
}

// events

calculatorButtons.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("calculator__button-normal"))
    manageClickButtons(e.target.id);
});

recordClear.addEventListener("click", clearRecord);

recordActive.addEventListener("click", activeRecordMobile);

recordSection.addEventListener("click", recordMobileHandler);
