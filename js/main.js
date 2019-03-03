// create a 9x9 Sudoku game board
// why 9x9? Because this is how Sudoku works
function createGameBoard() {
	var gameBoard = [];
	var gameBoardNumbers = [];

	// set up rows of 1 to 9 into 9 rows to form a Sudoku game board
	for (var a = 0; a < 9; a++) {
		var row = [];

		for (var b = 0; b < 9; b++) {
			row.push("x");
		}
		gameBoard[a] = row;
	}
	
	// generate numbers for game board
	generateGameBoardNumbers(gameBoard);

	return gameBoard;
}

// create game board GUI
function createGameBoardGUI(gameBoard) {
	var table = document.createElement("table");
	
	for (var a = 0; a < gameBoard.length; a++) {
		var tableRow = document.createElement("tr");

		for (var b = 0; b < gameBoard.length; b++) {
			var sectID_a = Math.floor( a / 3 );
			var sectID_b = Math.floor( b / 3 );

			var tableCell = document.createElement("td");
			var inputElement = document.createElement("input");

			inputElement.value = gameBoard[a][b];

			inputElement.setAttribute("type", "text");
			inputElement.setAttribute("maxlength", "1");
			inputElement.setAttribute("size", "1");
			inputElement.setAttribute("data-id", a + "," + b);

			if ((sectID_a + sectID_b) % 2 === 0 ) {
				inputElement.style.backgroundColor = "#ccc";
			}

			tableCell.appendChild(inputElement);
		  	tableRow.appendChild(tableCell);	
	
	  	}
	  	table.appendChild(tableRow);
	}
	
	document.getElementById("game-board").appendChild(table);
}

// generate numbers for the game board
function generateGameBoardNumbers(gameBoard) {
	//var lastFilledPosition = "";
	var gameNumberBank = generateRandomGameBoardNumbers(gameBoard);
	var uniqueNumberGroupIndex = createUniqueNumberGroupIndex(gameBoard);

	for (var r = 0; r < gameNumberBank.length; r++) {
		var filled = false;

		gameboard_outer_loop: for (var a = 0; a < gameBoard.length; a++) {
			gameboard_inner_loop: for (var b = 0; b < gameBoard[a].length; b++) {

				// fill the position with number only if it is empty
				if (gameBoard[a][b] === "x") {
					var neighbourNumbers = [];
					var boardPosition = a + "," + b;
					var matchingUniqueGroupIndex = [];

					for (var u = 0; u < uniqueNumberGroupIndex.length; u++) {
						if (uniqueNumberGroupIndex[u].indexOf(boardPosition) >= 0) {
							matchingUniqueGroupIndex.push(u);
						}
					}

					for (var m = 0; m < matchingUniqueGroupIndex.length; m++) {
						var v = matchingUniqueGroupIndex[m];

						for (var i = 0; i < 9; i++) {
							var index = uniqueNumberGroupIndex[v][i].split(",");

							if (uniqueNumberGroupIndex[v][i] !== boardPosition) {
								neighbourNumbers.push(gameBoard[index[0]][index[1]]);
							}
						}
					}

					if (neighbourNumbers.includes(gameNumberBank[r]) === false) {
						filled = true;
						//lastFilledPosition = boardPosition;
						gameBoard[a][b] = gameNumberBank[r];

						break gameboard_outer_loop;
					}
					else 
					{	
						gameBoard[a][b] = "x";
					}
				}
			}
		}

		if (filled === false) {
			//var index = lastFilledPosition.split(",");
			//gameBoard[index[0]][index[1]] = "x";
			console.log(gameNumberBank[r]);
		}

	}

	return gameBoard;
}

// generate randomly sort available numbers for the game board
function generateRandomGameBoardNumbers(gameBoard) {
	var gameNumbers = [];

	// generate game numbers
	for (var a = 0; a < gameBoard.length; a++) {
		for (var b = 0; b < gameBoard[a].length; b++) {
			gameNumbers.push(a + 1);
		}
	}

	// randomise game numbers
	gameNumbers.sort(function() { 
		return 0.5 - Math.random() 
	});

	return gameNumbers;
}

// create 27 groups of numbers, each of the group must contain numbers unique to each other
// there are 3 different types of group. 1st is row, 2nd is column and lastly is 9 different 3 x 3 boxes
// why 27 groups of these 3 profile? Because this is how Sudoku works
function createUniqueNumberGroupIndex(gameBoard) {
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

createGameBoardGUI(createGameBoard());