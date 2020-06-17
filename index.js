var mysql = require('mysql');
var express = require("express");
var app = express();
var port = 3000;

var con = mysql.createConnection({
  host: "localhost",
  user: "guille",
  password: "test",
  database: "upct"
});


app.use(express.static('public'));


con.connect(function(err) {
  if (err) throw err;
    
  console.log("Connected!");

  /*var sql = "SELECT * FROM titulaciones";
    
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log(result)
  })*/

    
 
});

app.listen(port, function(){
	 console.log(`Example app listening at http://localhost:${port}`);
});