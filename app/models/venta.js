// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;

var lineaVenta = require("./linea_venta").model;
var Producto = require("./producto").model;

exports.model = Bookshelf.Model.extend({
	tableName: "ventas",
	lineas: function() {
	  return this.hasMany(lineaVenta);
	},
	productos: function() {
    return this.hasMany(Producto).through(lineaVenta);
  }
});
