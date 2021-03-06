/*
 * GET home page.
 */

var Productos = require('../collections/productos').collection;
var Producto = require('../models/producto').model;

exports.listaJson = function(req, res) {
  if ( typeof req.user != 'undefined') {
    new Productos().fetch({
      withRelated : ['ventas']
    }).then(function(collection) {
      return res.send({
        productos : collection.toJSON()
      });
    });
  } else {
    return res.json(200, {
      msj : {
        error : 'No se ha iniciado la sesión <a href="/login">Iniciar</a>'
      }
    });
  }
};

exports.lista = function(req, res) {
  if ( typeof req.user != 'undefined') {
    new Productos().fetch({
      withRelated : ['insumos']
    }).then(function(collection) {
      return res.render('lista', {
        title : 'Lista de Productos',
        productos : collection.toJSON(),
        usuario : req.user
      });
    });
  } else {
    return res.redirect('/login');
  }
};

exports.nuevo = function(req, res) {
  if ( typeof req.user != 'undefined') {
    return res.render('show_edit', {
      title : 'Nuevo Producto',
      producto : {},
      usuario : req.user
    });
  } else {
    return res.redirect('/login');
  }
};

exports.editar = function(req, res) {
  if ( typeof req.user != 'undefined') {
    var prodId = req.params.id;
    new Producto({
      id : prodId
    }).fetch({
      withRelated : ['insumos']
    }).then(function(rProd) {
      if (rProd == undefined) {
        // no such result
        res.json(404, {
          error : "Producto no encontrado."
        });
      } else {
        console.log(rProd.toJSON());
        return res.render('show_edit', {
          title : 'Editar Producto',
          producto : rProd.toJSON(),
          usuario : req.user
        });
      }
    });
  } else {
    return res.redirect('/login');
  }
};

exports.crear = function(req, res) {
  if ( typeof req.user != 'undefined') {
    var id = req.params.id;
    var prod = req.body;
    if ( typeof id != 'undefined')
      prod.id = id;
    new Producto(prod).save();
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
};

exports.borrar = function(req, res) {
  if ( typeof req.user != 'undefined') {
    var id = req.params.id;
    new Producto({id:req.params.id}).fetch().then(function(model){
        return model.destroy().then(function () {
          console.log('destroyed!');
          return res.render('index',{usuario : req.user, msj:{ok:'Producto borrado correctamente!'}});
        });
    });
  } else {
    return res.redirect('/login');
  }
};
