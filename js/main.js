var playerGameBoard = [];
var answerGameBoard = [];

// create a 9x9 Sudoku game board
// why 9x9? Because this is how Sudoku works
function createGameBoard(diffcultyLevel) {
	// set up rows of 1 to 9 into 9 rows to form a Sudoku game board
	for (var a = 0; a < 9; a++) {
		var row = [];

		for (var b = 0; b < 9; b++) {
			row.push("x");
		}
		answerGameBoard[a] = row;
	}

	// seed answer game board by randomly placing number 1 to 9
	// generate 72 other numbers for answer game board
	seedGameBoard(answerGameBoard);
	generateGameBoardNumbers(answerGameBoard);

	return getPlayerGameBoard(answerGameBoard, diffcultyLevel);
}

// make a copy of the answer game board and randomly remove numbers to play
function getPlayerGameBoard(gameBoard, difficultyLevel) {
	for (var a = 0; a < gameBoard.length; a++) {
		var row = [];

		for (var b = 0; b < 9; b++) {
			row.push(gameBoard[a][b]);
		}
		playerGameBoard[a] = row;
	}

	for (var i = 0; i < difficultyLevel; i++) {
		var x = Math.floor((Math.random() * 9));
		var y = Math.floor((Math.random() * 9));

		if (playerGameBoard[x][y] !== "") {
			playerGameBoard[x][y] = "";
		}
		else {
			i--;
		}
	}

	return playerGameBoard;
}

// seed game board by randomly assign number 1 to 9 for 9 cells
function seedGameBoard(gameBoard) {
	for (var i = 1; i < 10; i++) {
		var x = Math.floor((Math.random() * 8));
		var y = Math.floor((Math.random() * 8));

		if (gameBoard[x][y] === "x") {
			gameBoard[x][y] = i;
		}
		else {
			i--;
		}
	}

	return gameBoard;
}

// get 72 unassigned cell position
function get72UnassignedCellPosition(gameBoard) {
	var unassigned = [];

	for (var a = 0; a < gameBoard.length; a++) {
		for (var b = 0; b < gameBoard[a].length; b++) {
				if (gameBoard[a][b] === "x") {
					unassigned.push(a + "," + b);
				}
		}
	}

	return unassigned;
}

// check neighbouring numbers based on the given cell position
function checkNeighbourNumbers(gameBoard, cellPosition) {
	var numbers = [];
	var matchingUniqueGroupIndex = [];
	var uniqueNumberGroupIndex = get27UniqueNumberGroupIndex(gameBoard);

	// look for the matching unique group row, column and 3x3 box from the unique number group
	for (var u = 0; u < uniqueNumberGroupIndex.length; u++) {
		if (uniqueNumberGroupIndex[u].indexOf(cellPosition) >= 0) {
			matchingUniqueGroupIndex.push(u);
		}
	}

	// get the neighbouring numbers from row, column and 3x3 box from the unique number group
	for (var m = 0; m < matchingUniqueGroupIndex.length; m++) {
		var v = matchingUniqueGroupIndex[m];

		for (var i = 0; i < 9; i++) {
			var index = uniqueNumberGroupIndex[v][i].split(",");

			if (uniqueNumberGroupIndex[v][i] !== cellPosition) {
				numbers.push(gameBoard[index[0]][index[1]]);
			}
		}
	}

	return numbers;
}

// get number violation index based on the given cell position
function checkForViolation(gameBoard, cellPosition, cellValue) {
    var violationIndex = [];
    var matchingUniqueGroupIndex = [];
    var uniqueNumberGroupIndex = get27UniqueNumberGroupIndex(gameBoard);

    // look for the matching unique group row, column and 3x3 box from the unique number group
    for (var u = 0; u < uniqueNumberGroupIndex.length; u++) {
        if (uniqueNumberGroupIndex[u].indexOf(cellPosition) >= 0) {
            matchingUniqueGroupIndex.push(u);
        }
    }

    for (var m = 0; m < matchingUniqueGroupIndex.length; m++) {
        var v = matchingUniqueGroupIndex[m];

        for (var i = 0; i < 9; i++) {
            var index = uniqueNumberGroupIndex[v][i].split(",");

            if (gameBoard[index[0]][index[1]] == cellValue) {
                violationIndex.push(index[0] + "," + index[1]);
            }
        }
    }

    return violationIndex;
}

// insert a number into the board for a given cell position
function insertNumber(gameBoard, cellPosition, cellValue) {
	var x = cellPosition.split(",")[0];
	var y = cellPosition.split(",")[1];

	// this is to prevent cells with number 9 from locking the backtrack.
	// set cell with 9 to x and it will cycle the number again in later loop iteration
	if (cellValue !== 10) {
		for (var r = cellValue; r < 10; r++) {
			var neighbourNumbers = checkNeighbourNumbers(gameBoard, cellPosition);

			// check if the number is unique against the neighbouring numbers
			if (neighbourNumbers.includes(r) === false) {
				gameBoard[x][y] = r;

				return true;
			}
		}
	}
	gameBoard[x][y] = "x";

	return false;
}

// generate numbers for the game board
function generateGameBoardNumbers(gameBoard) {
	var unassignedCellPosition = get72UnassignedCellPosition(gameBoard);

	for (var a = 0; a < unassignedCellPosition.length; a++) {
		console.log(0);
		var x = unassignedCellPosition[a].split(",")[0];
		var y = unassignedCellPosition[a].split(",")[1];

		cellValue = gameBoard[x][y];

		// start from 1 for empty cells
		if (cellValue === "x") {
			var insert = insertNumber(gameBoard, unassignedCellPosition[a], 1);
		}
		// start with +1 for cell with values
		else if (cellValue > 0 && cellValue < 10) {
			var insert = insertNumber(gameBoard, unassignedCellPosition[a], cellValue + 1);
		}

		if (insert === false) {
			a = a - 2;
		}
	}

	return gameBoard;
}

// create 27 groups of numbers, each of the group must contain numbers unique to each other
// there are 3 different types of group. 1st is row, 2nd is column and lastly is 9 different 3 x 3 boxes
// why 27 groups of these 3 profile? Because this is how Sudoku works
function get27UniqueNumberGroupIndex(gameBoard) {
	var group = [];
	var groups = [];

	// create row group
	for (var a = 0; a < gameBoard.length; a++) {
		for (var b = 0; b < gameBoard[a].length; b++) {
			group.push(a + "," + b);
		}

		groups.push(group);
		group = [];
	}

	// create column group
	for (var a = 0; a < gameBoard.length; a++) {
		for (var b = 0; b < gameBoard[a].length; b++) {
			group.push(b + "," + a);
		}

		groups.push(group);
		group = [];
	}

	// create 3 x 3 box group
	for (var a = 0; a < 3; a++) {
		for (var b = 0; b < gameBoard.length; b += 3) {
			for (var c = 0; c < gameBoard[b].length; c++) {
				if (c < 3) {
					group.push((b + 0) + "," + (c + (a * 3)));
				}
				if (c >= 3 && c < 6) {
					group.push((b + 1) + "," + ((c + (a * 3)) - 3));
				}
				if (c >= 6 && c < 9) {
					group.push((b + 2) + "," + ((c + (a * 3)) - 6));
				}
			}

			groups.push(group);
			group = [];
		}
	}

	return groups;
}

// create game board GUI
function createGameBoardGUI(gameBoard) {
	var myVar;
	var table = document.createElement("table");

	for (var a = 0; a < gameBoard.length; a++) {
		var tableRow = document.createElement("tr");

		for (var b = 0; b < gameBoard.length; b++) {
			var x = Math.floor( a / 3 );
			var y = Math.floor( b / 3 );

			if (gameBoard[a][b] === "") {
				var tableCell = document.createElement("td");
				var inputElement = document.createElement("input");

				inputElement.value = gameBoard[a][b];

				inputElement.setAttribute("type", "text");
				inputElement.setAttribute("maxlength", "1");
				inputElement.setAttribute("size", "1");
                inputElement.setAttribute("class", "board-input");
				inputElement.setAttribute("data-id", a + "," + b);

				// logic for styling game board
				if ((x + y) % 2 === 0 ) {
					inputElement.style.backgroundColor = "#ccc";
				}

				tableCell.appendChild(inputElement);
				tableRow.appendChild(tableCell);
			}
			else {
				var tableCell = document.createElement("td");
				var divElement = document.createElement("div");

                divElement.setAttribute("data-id", a + "," + b);
                divElement.setAttribute("class", "board-label");

				divElement.appendChild(document.createTextNode(gameBoard[a][b]));

				// logic for styling game board
				if ((x + y) % 2 === 0 ) {
					divElement.style.backgroundColor = "#ccc";
				}

				tableCell.appendChild(divElement);
				tableRow.appendChild(tableCell);
			}
	  	}
	  	table.appendChild(tableRow);
	}

	myVar = setTimeout(showPage, 2000);
	document.getElementById("game-board").appendChild(table);
}

function hint() {
    var violation = [];
    var input = document.getElementsByClassName("board-input");
    var labels = document.getElementsByClassName("board-label");

    // reset the board color first before doing anything
    for (var i = 0; i < labels.length; i++) {
            labels[i].style.color = "black";
    }

    // find violation
    for (var i = 0; i < input.length; i++) {
        if (input[i].value !== "") {
            violation = violation.concat(checkForViolation(playerGameBoard, input[i].getAttribute("data-id"),input[i].value));
        }
    }

    // set violated numbers  to red
    for (var a = 0; a < violation.length; a++) {
        for (var b = 0; b < labels.length; b++) {
            if (labels[b].getAttribute("data-id") == violation[a]) {
                labels[b].style.color = "#E35233";
            }
        }
    }
}

function clearInput() {
    var input = document.getElementsByClassName("board-input");
    var labels = document.getElementsByClassName("board-label");

    for (var i = 0; i < input.length; i++) {
        input[i].value = "";
    }

    for (var i = 0; i < labels.length; i++) {
        labels[i].style.color = "black";
    }

}

function showPage() {
    document.getElementById("game-setting").style.display = "none";
    document.getElementById("game-loader").style.display = "none";
	document.getElementById("game-board").style.display = "block";
    document.getElementById("game-option").style.display = "block";
	document.querySelector("footer").style.display = "block";
}

function generatePuzzle() {
	var difficultyLevel;

    document.getElementById("generatePuzzleBtn").disabled = true;
    document.getElementById("game-loader").style.display = "block";

	// get difficulty level
	if (document.getElementById('r1').checked) {
  		difficultyLevel = document.getElementById('r1').value;
	} else if (document.getElementById('r2').checked) {
  		difficultyLevel = document.getElementById('r2').value;
	} else if (document.getElementById('r3').checked) {
  		difficultyLevel = document.getElementById('r3').value;
	}
	createGameBoardGUI(createGameBoard(difficultyLevel));
}