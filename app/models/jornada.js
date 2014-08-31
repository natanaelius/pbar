// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;

exports.model = Bookshelf.Model.extend({
	tableName: "jornadas",
	ventas: function() {
	  var venta = require("./venta").model;
    return this.hasMany(venta,'jornada_id');
  }
});

