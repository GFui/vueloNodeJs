var mysql = require('mysql');
var express = require("express");
var app = express();
var port = 3000;

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "vuelos"
});

app.use(express.static('public'));

//Funcion para crear vuelo
app.get('/vuelos/vuelosC/:vueloC/:origenC/:destinoC/:salidaC/:llegadaC/:precio_businessC/:precio_optimaC/:precio_economyC/:plazas_businessC/:plazas_optimaC/:plazas_economyC', function (req, res) {
	console.log("crear vuelo");
	var sql = "INSERT INTO vuelos VALUES (?,?,?,?,?,?,?,?,?,?,?)";
	var DatosVuelo = {
		vueloC: req.params.vueloC,
        origenC: req.params.origenC,
        destinoC: req.params.destinoC,
        salidaC: req.params.salidaC,
        llegadaC: req.params.llegadaC,
        precio_businessC: req.params.precio_businessC,
        precio_optimaC: req.params.precio_optimaC,
        precio_economyC: req.params.precio_economyC,
        plazas_businessC: req.params.plazas_businessC,
        plazas_optimaC: req.params.plazas_optimaC,
		plazas_economyC: req.params.plazas_economyC
	};
	
	con.query(sql, [DatosVuelo.vueloC, DatosVuelo.origenC, DatosVuelo.destinoC, DatosVuelo.salidaC, DatosVuelo.llegadaC, DatosVuelo.precio_businessC, DatosVuelo.precio_optimaC, DatosVuelo.precio_economyC, DatosVuelo.plazas_businessC, DatosVuelo.plazas_optimaC, DatosVuelo.plazas_economyC], function (err, result) {
		if (err) throw err;		
		console.log("1 record inserted");
        res.send(result);
	});
	
});
//Funcion para loguear compañia
app.get('/vuelos/log/:usuario/:password', function (req, res) {
	console.log("Buscando usuario");
	var sql = "SELECT * FROM aerolineas WHERE name = ? AND passwd = ?";
	var aerolineas = {
		usuario: req.params.usuario,
		password: req.params.password
	};
	
	con.query(sql, [aerolineas.usuario, aerolineas.password], function (err, result) {
		if (err) throw err;
		
		res.send(result);
	});
	
});

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
