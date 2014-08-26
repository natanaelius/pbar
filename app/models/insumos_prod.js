// Import the initialized Bookshelf
var Bookshelf = require('bookshelf').DB;

var Producto = require("./producto").model;
var Insumo = require("./insumo").model;

exports.model = Bookshelf.Model.extend({
	tableName: "insumosProd",
	insumo: function (){
	   var ins = new Insumo({id:this.insumo_id})
	   .fetch({}).then(function(rIns) {
        if (rIns == undefined) {
          // no such result
          return {};
        }
        else {
          return rIns.toJSON();
        }
      });
	}
});