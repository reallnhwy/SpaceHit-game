var turn = 'X';
var game_size = 3;
var total_turns = 0;
var robot = true;
var finished = false;

var selections = new Array(); 
selections['X'] = new Array();
selections['O'] = new Array();

var scores = new Array(); 
scores['X'] = 0;
scores['O'] = 0;

// Resetting parameters on reseting game
function resetParams() {
turn = 'X';
game_size = 3;
total_turns = 0;
robot = true;
finished = false;

selections['X'] = new Array();
selections['O'] = new Array();
}


// Change turn after another
function changeTurn(){
if (turn == 'X') turn = 'O';
else turn = 'X';
}


// Winner patterns, match selected patterns on every turn for every player
function winnerPatterns() {
var wins = Array();

// check win for size 3 x 3
if (game_size==3) wins = [ 
							[11,12,13], [21,22,23], [31,32,33],
							[11,21,31], [12,22,32], [13,23,33], 
							[11,22,33], [13,22,31]
						];


// check win for size 4 x 4
if (game_size==4) wins = [ 
							[11,12,13,14], [21,22,23,24], [31,32,33,34], 
							[41,42,43,44], [11,21,31,41], [12,22,32,42], 
							[13,23,33,43], [14,24,34,44],
							[14,23,32,41], [11,22,33,44]
						];


// check win for size 5 x 5
if (game_size==5) wins = [ 
							[11,12,13,14,15], [21,22,23,24,25], [31,32,33,34,35], 
							[11,21,31,41,51], [12,22,32,42,52], [13,23,33,43,53], 
							[11,22,33,44,55], [15,24,33,42,51], [14,24,34,44,54], 
							[41,42,43,44,45], [51,52,53,54,55], [15,25,35,45,55]
						];


// check win for size 6 x 6
if (game_size==6) wins = [
							[11,12,13,14,15], [21,22,23,24,25], [31,32,33,34,35], [41,42,43,44,45], 
							[12,13,14,15,16], [22,23,24,25,26], [32,33,34,35,36], [42,43,44,45,46], 
							[11,21,31,41,51], [12,22,32,42,52], [13,23,33,43,53], [14,24,34,44,54], 
							[21,31,41,51,61], [22,32,42,52,62], [23,33,43,53,63], [24,34,44,54,64], 
							[11,22,33,44,55], [22,33,44,55,66], [16,25,34,43,52], [25,34,43,52,61],
							[12,23,34,45,56], [21,32,43,54,65], [15,24,33,42,51], [26,35,44,53,62],
							[25,35,45,55,65], [26,36,46,56,66], [15,25,35,45,55], [16,26,36,46,56],
							[51,52,53,54,55], [61,62,63,64,65], [52,53,54,55,56], [62,63,64,65,66]
						];

// check win for size 7 x 7
if (game_size==7) wins = [
							[11,12,13,14,15], [21,22,23,24,25], [31,32,33,34,35], [41,42,43,44,45], [51,52,53,54,55], [61,62,63,64,65], 
							[12,13,14,15,16], [22,23,24,25,26], [32,33,34,35,36], [42,43,44,45,46], [52,53,54,55,56], [62,63,64,65,66], 
							[13,14,15,16,17], [23,24,25,26,27], [33,34,35,36,37], [43,44,45,46,47], [53,54,55,56,57], [63,64,65,66,67], 
							[11,21,31,41,51], [12,22,32,42,52], [13,23,33,43,53], [14,24,34,44,54], [15,25,35,45,55], [16,26,36,46,56], 
							[21,31,41,51,61], [22,32,42,52,62], [23,33,43,53,63], [24,34,44,54,64], [25,35,45,55,65], [26,36,46,56,66], 
							[31,41,51,61,71], [32,42,52,62,72], [33,43,53,63,73], [34,44,54,64,74], [35,45,55,65,75], [36,45,54,63,72],
							[11,22,33,44,55], [22,33,44,55,66], [33,44,55,66,77], [12,23,34,45,56], [23,34,45,56,67], [27,37,47,57,67],
							[31,42,53,64,75], [13,24,35,46,57], [21,32,43,54,65], [32,43,54,65,76], [36,46,56,66,76], [37,47,57,67,77],
							[26,35,44,53,62], [17,26,35,44,53], [35,44,53,62,71], [16,25,34,43,52], [25,34,43,52,61], [27,36,45,54,63], 
							[37,46,55,64,73], [15,24,33,42,51], [71,72,73,74,75], [72,73,74,75,76], [73,74,75,76,77], [17,27,37,47,57]
						]
return wins
}


// Robot patterns, for auto players of every game board
function DefaultRobotPatterns() {
var robot_turns = Array();

// 3 x 3 winning patterns;
if (game_size==3) robot_turns = [22,11,33,13,21,23,12,32,31];

// 4 x 4 winning patterns;
if (game_size==4) robot_turns = [11,22,33,44,14,13,12,21,31,41,42,43,24,34,32,23];

// 5 x 5 winning patterns;
if (game_size==5) robot_turns = [11,22,33,44,55,15,14,13,12,51,41,31,21,35,45,25,53,52,54,42,43,32,34,23,24];

// 6 x 6 winning patterns
if (game_size==6) robot_turns = [11,22,33,44,55,16,15,14,13,12,61,51,41,31,21,35,45,26,43,42,54,53,52,23,24,25,65,63,64,62,56,46,36,66];

// 7 x 7 winning patterns
if (game_size==7) robot_turns = [11,22,33,44,55,16,15,14,13,12,61,71,77,51,41,31,21,35,45,72,26,43,42,54,53,73,75,52,23,24,25,74,65,63,76,64,62,56,46,36,66]
return robot_turns
}


// Checking winner of selected type on selection
function checkWinner() {

var selected = selections[turn].sort();
var win_patterns = winnerPatterns();

finished = false;
for (var x=0; x < win_patterns.length; x++) {
	
	if (finished != true) { 
		finished = isWinner(win_patterns[x], selections[turn]);

		if ( finished === true ) {
			
			// Updating score card
			scoreUpdate(turn);

			// On winning disabled all boxes
			disableAllBoxes();

			alert('Player '+turn+' Won !!');
			
			break;
		} 
	}
}

// Declare draw if no one wins 
if (( total_turns == (game_size*game_size)) && finished === false ) { 
	alert('Game Draw!');
	finished = true;
	disableAllBoxes(); 
}
}


// Verifying each selections with winning pattern
function isWinner(win_pattern, selections){

var match = 0;

for (var x=0; x<win_pattern.length; x++) {
	for (var y=0; y<selections.length; y++) {
		if (win_pattern[x]==selections[y]) {
			match++;
		}
	}
}

if (match==win_pattern.length) return true;

return false;
}


// Disable all boxes after winning/draw
function disableAllBoxes() {

var elements = document.getElementsByClassName("grid-box");
for (var i = 0; i < elements.length; i++) {
	elements[i].disabled =true;
}

}


//back to default value for robot checkbox
function resetRobotButton() {
var checkbox = document.getElementById('robot'); 	
checkbox.checked = 'checked';
}


// Generating a board for new game
function generateGame(){

// reset all the game related parameters
resetParams();

//Get choosing size board
game_size = Number(document.getElementById('game_size').value);

// is auto player selected 
robot_object = document.getElementById('robot'); 
if (robot_object.checked === true) robot = true; 
else  robot = false;

// Clearing board for new game	
document.getElementById('game-board').innerHTML = '';

// Generating board
for (var row = 1; row <= game_size; row++){
	for (var col = 1; col <= game_size; col++) {
		var unique_name = 'grid-'+row+'-'+col;
		var unique_id = row+''+col;
		var button = document.createElement("input");

		button.setAttribute("value", ' ');
		button.setAttribute("id", unique_id);
		button.setAttribute("name", unique_name);
		button.setAttribute("class", 'grid-box');
		button.setAttribute("type", 'button');
		button.setAttribute("onclick", "markCheck(this)");
		document.getElementById('game-board').appendChild(button);
	}

	var breakline = document.createElement("br");
		document.getElementById('game-board').appendChild(breakline);
}

}


// Selecting check for desired position
function markCheck(obj){

obj.value = turn;
total_turns++;

if (turn == 'X' ) {
	obj.setAttribute("class", 'XX-player');
} else {
	obj.setAttribute("class", 'OO-player');
}

//this is to prevent players from marking the same box 
obj.setAttribute("disabled", 'disabled');
//To add the box number to selections array
selections[turn].push(Number(obj.id));

checkWinner();
changeTurn();

// if auto player selected
if (robot===true) autoTurn();
}


// Auto player robot turn for O
function autoTurn(again=false) {

// Ignore for X player as well as if already finished
if (turn === 'X' || finished === true) return false;

// Get which winning pattern match most
// Run according to the selected pattern
var robot_pattern = '';
if (again==true) robot_pattern = DefaultRobotPatterns();
else robot_pattern = getAutoTurnPattern(); //pattern 1

for(var x = 0; x < robot_pattern.length; x++) {
	var desired_obj = document.getElementById(robot_pattern[x]);
	if (desired_obj.value == '' || desired_obj.value == ' ') { 
		markCheck(desired_obj); 
		
		break;
	} 
}

}


// Getting most nearest winning and lossing pattern
function getAutoTurnPattern() {

var pattern = [];
pattern = getMostNearestPattern('O');
if (pattern.length <= 0) {
	pattern = getMostNearestPattern('X');
	if (pattern.length <= 0) {
		pattern = DefaultRobotPatterns();
	}
}

return pattern;

}


// Getting most applicable pattern for any player
function getMostNearestPattern(turn){

var matches = 0;

var selected = selections[turn].sort();
var win_patterns = winnerPatterns();

finished = false;
for (var x=0; x < win_patterns.length; x++) {
	var intersected = intersectionArray(selected, win_patterns[x]);
	
	//check every partern if the intersection is low then check until nothing left and return empty
	//otherwise run the inside loop
	if ( intersected.length==(win_patterns[x].length-1) ) { //return win_patterns[x];

		// if any position is found empty then return that pattern; otherwise will check another one from list
		for (var y=0; y < win_patterns[x].length; y++) {
			obj = document.getElementById(win_patterns[x][y]);
			if (obj.value == '' || obj.value == ' ') {
				//check empty box	
			}return win_patterns[x];	
		}
	}
}
return [];
}



//Comparing intersection and return result 
function intersectionArray(x, y){

var response = [];
for (var i = 0; i < x.length; i++) {
	for (var z = 0; z < y.length; z++) {
		if (x[i] == y[z]) {
			response.push(x[i]);
			break;
		}
	}
}
return response;

}

//Update score
function scoreUpdate(turn){
scores[turn]++;
document.getElementById('score-'+turn).innerHTML = scores[turn];
}
