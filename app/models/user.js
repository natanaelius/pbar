/* 
 * This is the model representation of the Users table. It represents a single
 * user.
 */

var Bookshelf = require('bookshelf').DB;

exports.model = Bookshelf.Model.extend({
	tableName: "usuarios",
	ventas: function() {
		var Venta = require("./venta").model;
		return this.hasMany(Venta, "usuario_id");
	}
});
