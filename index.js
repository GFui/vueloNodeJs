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
app.get('/vuelos/ida/:origen/:destino/:salida/:numeroDePasajeros', function (req, res) {
	
	var sql = "SELECT * FROM vuelos WHERE origen = ? AND destino = ? and salida like ? and plazas_economy >= ? and plazas_optima >= ? and plazas_business > ?";
	console.log("Buscando idas");
	var vuelo = {
		origen: req.params.origen,
		destino: req.params.destino,
		salida: req.params.salida,
		numeroDePasajeros: req.params.numeroDePasajeros
	};
	
	con.query(sql, [vuelo.origen, vuelo.destino, '%' + vuelo.salida +'%', vuelo.numeroDePasajeros, vuelo.numeroDePasajeros, vuelo.numeroDePasajeros ], function (err, result) {
		if (err) throw err;
		
		res.send(result);
	});
	
});

//Obtener la vuelta
app.get('/vuelos/vuelta/:origen/:destino/:salidaVuelta', function (req, res){
	var sql = "SELECT * FROM vuelos WHERE origen = ? AND destino = ? and salida > ?";
	console.log("Buscando vueltas");
	var vueloVuelta = {
		origen: req.params.origen,
		destino: req.params.destino,
		salidaVuelta: req.params.salidaVuelta
	};

	con.query(sql, [vueloVuelta.origen, vueloVuelta.destino, vueloVuelta.salidaVuelta], function(err, result){
		if(err) throw err;
		
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
