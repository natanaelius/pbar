/* 
 * This represents a collection of all tweets in the Tweets table. We only really
 * use this for our list method.
 */

var Bookshelf = require('bookshelf').DB;
var Producto = require("../models/producto").model;

exports.collection = Bookshelf.Collection.extend({
	model: Producto
});