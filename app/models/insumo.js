// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;

exports.model = Bookshelf.Model.extend({
	tableName: "insumos",
	insumos: function () {
	  var Producto = require("./producto").model;
    return this.belongsToMany(Producto);
  }
});