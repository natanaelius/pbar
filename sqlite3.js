var fs = require("fs");
var file = "bar.sqlite3";
var exists = fs.existsSync(file);

var crearTablas=false;
if (!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
  crearTablas=true;
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
if (crearTablas){
  db.run("DROP TABLE IF EXISTS productos");
  db.run("CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY, nombre TEXT, descripcion TEXT, precio INT, stock INT, ts TEXT)");
  console.log("La tabla productos ha sido correctamente creada");
  db.run("DROP TABLE IF EXISTS ventas");
  db.run("CREATE TABLE IF NOT EXISTS ventas (id INTEGER PRIMARY KEY,nombre TEXT, usuario INT, estado TEXT, activa INT, ts TEXT)");
  console.log("La tabla ventas ha sido correctamente creada");
  db.run("DROP TABLE IF EXISTS lineaventa");
  db.run("CREATE TABLE IF NOT EXISTS lineaventa (id INTEGER PRIMARY KEY,venta_id INT, prod_id INT, cantidad INT, precio INT, estado text, ts TEXT)");
  console.log("La tabla lineaventa ha sido correctamente creada");
}

module.exports = db;