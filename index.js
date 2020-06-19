var mysql = require('mysql');
var express = require("express");
var app = express();
var port = 3000;

var con = mysql.createConnection({
	host: "localhost",
	user: "guille",
	password: "test",
	database: "vuelosNode"
});

app.use(express.static('public'));

con.connect(function (err) {
	if (err) throw err;

	console.log("Connected!");

	var sql = "SELECT * FROM aerolineas";

	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log(JSON.parse(JSON.stringify(result)));
	})

});

//Esto tiene que ir lo ultimo porque se queda bloqueando!
app.listen(port, function () {
	console.log(`Example app listening at http://localhost:${port}`);
});
