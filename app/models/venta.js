// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;

var Linea = require("./linea").model;
var Producto = require("./producto").model;

exports.model = Bookshelf.Model.extend({
	tableName: "ventas",
	lineas: function() {
	  return this.hasMany(Linea);
	},
	prod_ingresado: function() {
    var Producto = require("./producto").model;
    return this.belongsToMany(Producto).through(Linea).query({where: {estado: 'ingresado'}}).withPivot(['cantidad','precio']);
  },
  prod_servido: function() {
    var Producto = require("./producto").model;
    return this.belongsToMany(Producto).through(Linea).query({where: {estado: 'servido'}}).withPivot(['cantidad','precio']);
  }
});
