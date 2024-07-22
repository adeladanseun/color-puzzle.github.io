let color = [];
let palette;
const puzzleBox = document.querySelectorAll(".maingame div");
const showBox = document.querySelectorAll(".description div");
const emptyBox = document.querySelector(".empty"); //only gets the first of the two
const descriptionDivs = document.querySelectorAll("div.description > div");
const maingameDivs = document.querySelectorAll("div.maingame > div");
const newGameBtn = document.getElementById("newGame");
newGameBtn.tabIndex = 0;
const helpBtn = document.querySelector("nav ul li.help");
helpBtn.tabIndex = 0;
const puzzleArray = [
  [0, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];
const showBoxArray = [
  [0, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]; //not to be changed
function fRandomColorNumber() {
  return Math.round(0 + Math.random() * 254);
}
function fRandomColor(alpha = false) {
  if (!alpha)
    return `rgb(${fRandomColorNumber()}, ${fRandomColorNumber()}, ${fRandomColorNumber()})`;
  else
    return `rgba(${fRandomColorNumber()}, ${fRandomColorNumber()}, ${fRandomColorNumber()}, ${parseFloat(
      Math.random().toFixed(2)
    )})`;
}
function fillColor(num = 20) {
  color = [];
  for (let i = 0; i < num; i++) {
    color.push(fRandomColor());
  }
}
function generatePalette(num = 8) {
  const colorToUse = [];
  while (colorToUse.length < num) {
    let randomIndex = Math.round(Math.random() * (color.length - 1));
    if (!colorToUse.includes(color[randomIndex])) {
      colorToUse.push(color[randomIndex]);
    }
  }
  palette = colorToUse;
  return colorToUse;
}
function resetArrays(array) { //causes an in-place change on the array argument unless destructured when called
  array[0] = [0, 1, 1];
  array[1] = [1, 1, 1];
  array[2] = [1, 1, 1];
}
function newGame() {
  fillColor(20);
  resetArrays(puzzleArray);
  resetArrays(showBoxArray);
  resetPuzzleBox(maingameDivs) //serious problem here
  solveAnimation();
  solveAnimation(descriptionDivs);
  populateShowBoxes();
  populatePuzzleBoxes();
  populateArrays(palette);
}
newGame();
function isSolved() {
  let solved = true;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (puzzleArray[i][j] !== showBoxArray[i][j]) {
        solved = false;
        return solved;
      }
    }
  }
  return solved;
}
function populateArrays(colors) {
  let colorArray = [...colors]; //make copy of array
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === 0 && j === 0) continue;
      let color = colorArray[count++];
      //puzzleArray[i][j] = color;
      showBoxArray[i][j] = color;
    }
  }
}
function setPalette() {
  palette = generatePalette();
}
function populateShowBoxes() {
  setPalette();
  let count = 0;
  descriptionDivs.forEach((slot) => {
    if (slot.classList.contains("empty")) {
      slot.style["background-color"] = "white";
    } else slot.style["background-color"] = palette[count++];
  });
}
function populatePuzzleArray(colors) {
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === 0 && j === 0) continue;
      puzzleArray[i][j] = colors[count];
      count++;
    }
  }
}
function populatePuzzleBoxes() {
  let [...array] = palette;
  let puzzleArrayInput = [];
  maingameDivs.forEach((slot) => {
    if (slot.classList.contains("empty")) {
      slot.style["background-color"] = "white";
    } else {
      let num = Math.floor(Math.random() * array.length);
      let color = array[num];
      puzzleArrayInput.push(color);
      slot.style["background-color"] = color;
      array = array.filter((color) => color !== slot.style["background-color"]);
    }
  });
  populatePuzzleArray(puzzleArrayInput);
}

function coordConverter(coord) {
  let returnArray = [];
  let array = coord.split(","); //produces ["{row: 1", "col: 2}"]
  array.forEach((subString) => {
    returnArray.push(parseInt(subString.split(" ")[1][0])); //gets the numbers out of the two entries
  });
  return { row: returnArray[0], col: returnArray[1] };
}
function movable(box) {
  //checks if box is moveable
  //position dataset are strings and not in a format convertible by json function
  let emptyPosition = coordConverter(emptyBox.dataset["position"]);
  let boxPosition = coordConverter(box.dataset["position"]);
  //four conditions for a box to be movable
  if (
    (boxPosition.row - 1 === emptyPosition.row &&
      boxPosition.col === emptyPosition.col) ||
    (boxPosition.row + 1 === emptyPosition.row &&
      boxPosition.col === emptyPosition.col) ||
    (boxPosition.col - 1 === emptyPosition.col &&
      boxPosition.row === emptyPosition.row) ||
    (boxPosition.col + 1 === emptyPosition.col &&
      boxPosition.row === emptyPosition.row)
  ) {
    return true;
  } else {
    return false;
  }
}
function solveAnimation(divElement = maingameDivs) {
  divElement.forEach((slot) => {
    slot.classList.add("shrink");
    setTimeout(() => {
      slot.classList.remove("shrink");
    }, Math.floor(Math.random() * 500));
  });
}

function changePuzzleState(rowValue, colValue, adder, constant) {
  let clickedValue = puzzleArray[rowValue][colValue];
  let emptyValue;
  if (constant === "col") {
    emptyValue = puzzleArray[rowValue + adder][colValue];
    puzzleArray[rowValue + adder][colValue] = clickedValue;
    puzzleArray[rowValue][colValue] = emptyValue;
  } else {
    emptyValue = puzzleArray[rowValue][colValue + adder];
    puzzleArray[rowValue][colValue + adder] = clickedValue;
    puzzleArray[rowValue][colValue] = emptyValue;
  }
}
function moveBox(box) {
  let emptyPosition = coordConverter(emptyBox.dataset["position"]);
  let boxPosition = coordConverter(box.dataset["position"]);
  if (boxPosition.col === emptyPosition.col) {
    if (boxPosition.row > emptyPosition.row) {
      changePuzzleState(boxPosition.row, boxPosition.col, -1, "col");
    } else if (boxPosition.row < emptyPosition.row) {
      changePuzzleState(boxPosition.row, boxPosition.col, 1, "col");
    }
  } else if (boxPosition.row === emptyPosition.row) {
    if (boxPosition.col > emptyPosition.col) {
      changePuzzleState(boxPosition.row, boxPosition.col, -1, "row");
    } else if (boxPosition.col < emptyPosition.col) {
      changePuzzleState(boxPosition.row, boxPosition.col, 1, "row");
    }
  }
  box.style["gridRow"] = emptyBox.dataset["gridarea"][0];
  box.style["gridColumn"] = emptyBox.dataset["gridarea"][2];
  emptyBox.style["gridRow"] = box.dataset["gridarea"][0];
  emptyBox.style["gridColumn"] = box.dataset["gridarea"][2];
  let temp = emptyBox.dataset["gridarea"];
  emptyBox.dataset["gridarea"] = box.dataset["gridarea"];
  box.dataset["gridarea"] = temp;
  box.dataset[
    "position"
  ] = `{row: ${emptyPosition.row},col: ${emptyPosition.col}}`;
  emptyBox.dataset[
    "position"
  ] = `{row: ${boxPosition.row},col: ${boxPosition.col}}`;
  if (isSolved()) {
    //solve animation and new game
    newGame();
  } else {
    //can add a move counter here resettable on start of new game
  }
}
function resetPuzzleBox(boxes) {
  let row = 0
  let col = 0
  boxes.forEach(box => {
    row++
    col++ //increases the row and col value temporarily as the count of gridArea starts from 1 while that of positon starts from 0
    box.style['gridRow'] = ''
    box.style['gridColumn'] = ''
    box.dataset['gridarea'] = `${row} ${col}`
    row--
    col-- //decreases both to satisfy above condition in comment
    box.dataset['position'] = `{row: ${row},col: ${col}}`
    if (col === 2) {
      row++
      col = 0
    } else {
      col++
    }
  })
}
function boxClick(e) {
  if (movable(e.target) && !e.target.dataset["empty"]) {
    //if clicked box is next to empty in the valid sense and is not empty
    //move
    moveBox(e.target);
    //checks for correction by calling solved
  } else {
    //causes the box to vibrate
    e.target.classList.add("vibrate");
    setTimeout(() => {
      e.target.classList.remove("vibrate");
    }, 500);
  }
}
function addEffect(e) {
  if (!e.target.dataset["empty"]) {
    descriptionDivs.forEach((slot) => {
      if (
        slot.style["background-color"] === e.target.style["background-color"]
      ) {
        slot.classList.add("effect");
        return;
      }
    });
  }
}
function removeEffect(e) {
  if (!e.target.dataset["empty"]) {
    descriptionDivs.forEach((slot) => {
      if (
        slot.style["background-color"] === e.target.style["background-color"]
      ) {
        slot.classList.remove("effect");
        return;
      }
    });
  }
}
puzzleBox.forEach((box) => {
  box.tabIndex = 0;
  box.addEventListener("click", boxClick);
  box.addEventListener("keypress", (e) => {
    if ((e.key = "Enter")) {
      boxClick(e);
    }
  });
  box.addEventListener("mouseover", addEffect);
  box.addEventListener("mouseout", removeEffect);
  box.addEventListener("focusin", addEffect);
  box.addEventListener("focusout", removeEffect);
});
newGameBtn.addEventListener("click", newGame);
helpBtn.addEventListener("click", () => {
  document.querySelector("nav ul li.help p").classList.toggle("showhelp");
});
helpBtn.addEventListener("blur", () => {
  document.querySelector("nav ul li.help p").classList.remove("showhelp");
});
