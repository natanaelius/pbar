
/*
 * GET home page.
 */

var Productos = require('../app/collections/productos').collection;
var Producto  = require('../app/models/producto').model;

exports.list = function(req, res) {
  new Productos().fetch({withRelated: ['insumos']}).then(function(collection) {
    return res.send(collection.toJSON());
  });
};
exports.lista = function(req, res) {
  new Productos().fetch({withRelated: ['insumos']}).then(function(collection) {
    return res.render('lista', {
      title : 'Lista de Productos',
      productos : collection.toJSON()
    });
  });
};

exports.nuevo = function (req,res) {
  return res.render('show_edit', {
      title : 'Nuevo Producto',
      producto : {}
    });
};

exports.editar = function (req,res) {
  var prodId = req.params.id;

  new Producto({
    id: prodId
  }).fetch({withRelated: ['insumos']}).then(function(rProd) {
    if (rProd == undefined) {
      // no such result
      res.json(404,{error: "Producto no encontrado."});
    }
    else {
      console.log(rProd.toJSON());
        return res.render('show_edit', {
          title : 'Editar Producto',
          producto : rProd.toJSON()
        });
    }
  });
};

exports.crear = function (req,res) {
  var id = req.params.id;
  var prod = req.body;
  if (typeof id != 'undefined') prod.id = id;
  new Producto(prod).save();
  return res.redirect('/');
};

exports.borrar = function(req, res) {
  var id = req.params.id;
  db = require("../sqlite3");
  db.run("DELETE FROM productos WHERE id=?", id, function(e) {
    if (e === null) {
      console.log('Venta con ID [' + id + '] ha sido borrada correctamente');
      db.run("DELETE FROM insumos_productos WHERE producto_id=?", id, function(e) {
        if (e === null){
          return res.redirect('/');
        }
        else {
          console.log('Error', e);
        }
          
      });
    } else
      console.log('Error', e);
  });
};
