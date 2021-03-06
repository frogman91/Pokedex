var config = {
  apiKey: "AIzaSyBAD9iAQ89v6xwSdOW7HtBeHfd2olY8oYE",
  authDomain: "homework7-568d3.firebaseapp.com",
  databaseURL: "https://homework7-568d3.firebaseio.com",
  projectId: "homework7-568d3",
  storageBucket: "homework7-568d3.appspot.com",
  messagingSenderId: "544702545302"
};

firebase.initializeApp(config);

var database = firebase.database();

var pokemon = database.ref("/pokemon");

database.ref("/pokemon").on("value", function(snapshot) {

	$("#pkmnData").empty();
	snapshot.forEach(function(snapshotChild) {
		console.log(snapshotChild.key);
		var pokeObj = { 
			name: snapshotChild.val().name,
			type: snapshotChild.val().type,
			dayCaught: snapshotChild.val().dayCaught,
			exp: snapshotChild.val().exp,
			monthsTrained: snapshotChild.val().monthsTrained,
			rate: snapshotChild.val().rate,
			key: snapshotChild.key
		};
		updateTable(pokeObj);
	});

});

function updateTable(val){
	$("#pkmnData").append("<tr><td>" + 
		val.name + "</td><td>" + val.type + "</td><td>" + 
		val.dayCaught + "</td><td>" + val.rate + "</td><td>" + 
		val.monthsTrained + "</td><td>" + val.exp + "</td><td><button class='removePkmn' data-value='" + 
		val.key + "'>x</button></td></tr>");
}

$("#btnSubmit").on("click", function(event) {

	event.preventDefault();

	console.log("click");
	
	var name = $("#name").val().trim();
	var type = $("#type").val().trim();
	var dayCaught = $("#caught").val().trim();
	console.log(dayCaught);
	var dayCaughtArr = dayCaught.split("-");
	var rate = parseInt($("#expRate").val().trim());
	var monthsTrained = calcMonths(dayCaughtArr);
	if (monthsTrained >= 0) {
		var exp = parseInt((monthsTrained*rate)/500);
	}
	else {
		var exp = "N/A";
		monthsTrained = "Invalid Date";
	}

	database.ref("/pokemon").push({
		name: name,
		type: type,
		dayCaught: dayCaught,
		rate: rate,
		monthsTrained: monthsTrained,
		exp: exp
	});

	$("#name, #type, #caught, #expRate").val("");
});

$("body").on("click", ".removePkmn", function() {

	database.ref("/pokemon").child($(this).attr("data-value")).remove();

});

function calcMonths(arr) {
	var sum = 0;

	if (parseInt(arr[0]) > 2017 || parseInt(arr[1]) > 12 || parseInt(arr[2]) > 31) {
		return -1;
	}
	if (parseInt(arr[0]) < 2017) {
		sum += (8 - parseInt(arr[1]));
		sum += (12*(2017 - parseInt(arr[0])));
	}
	else if (parseInt(arr[0]) === 2017 && parseInt(arr[1]) <= 8) {
		sum += (8 - parseInt(arr[1]));
	}
	else  {
		return -1;
	}

	return sum;

}