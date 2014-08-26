// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;



exports.model = Bookshelf.Model.extend({
	tableName: "productos",
	insumos: function() {
	  var Insumo = require("./insumo").model;
		return this.belongsToMany(Insumo).withPivot(['cantidad']);
	}
});

