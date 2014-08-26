// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;
var Linea = require("./linea").model;


exports.model = Bookshelf.Model.extend({
	tableName: "productos",
	insumos: function() {
	  var Insumo = require("./insumo").model;
		return this.belongsToMany(Insumo).withPivot(['cantidad']);
	},
	lineas: function() {
    return this.hasMany(Linea);
	},
	lineas_ns: function() {
    return this.hasMany(Linea).query({where: {estado: 'ingresado'}});
  },
	ventas: function() {
    var Venta = require("./venta").model;
    return this.belongsToMany(Venta).through(Linea);
  }
});

