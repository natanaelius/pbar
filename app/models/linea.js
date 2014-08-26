// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;

exports.model = Bookshelf.Model.extend({
	tableName: "linea",
	venta: function() {
	  var venta = require("./venta").model;
    return this.belongsTo(venta,'venta_id');
  },
  producto: function() {
    var producto = require("./producto").model;
    return this.belongsTo(producto,'producto_id');
  }
});

