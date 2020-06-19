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

//Funcion para buscar los vuelos de IDA
app.get('/vuelos/:origen/:destino/:salida', function (req, res) {
	
	var sql = "SELECT * FROM vuelos WHERE origen = ? AND destino = ? and salida like ?";
	
	var vuelo = {
		origen: req.params.origen,
		destino: req.params.destino,
		salida: req.params.salida
	}
	
	con.query(sql, [vuelo.origen, vuelo.destino, '%' + vuelo.salida +'%'], function (err, result) {
		if (err) throw err;
		
		res.send(result);
	});
	
});

con.connect(function (err) {
	if (err) throw err;

	console.log("Connected to MySQL!");

});

//Esto tiene que ir lo ultimo porque se queda bloqueando!
app.listen(port, function () {
	console.log("VueloBonitoBarato listening at http://localhost:"+ port);
});
