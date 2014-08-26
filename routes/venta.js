
/*
 * GET home page.
 */
var _ = require('underscore-node');

var Ventas = require('../app/collections/ventas').collection;
var Venta  = require('../app/models/venta').model;
var lineaVentas  = require('../app/collections/linea_ventas').collection;

exports.list = function(req, res) {
  new lineaVentas().fetch({withRelated: ['venta','producto']}).then(function(lv) {
    ventas=_.groupBy(lv.toJSON(), function(d){
      return 'venta-'+d.venta.id;
    });
    return res.send({ventas:{data:ventas}});
  });
  /*
  new Ventas().fetch({withRelated: ['lineas']}).then(function(ventas) {
    ventas.mapThen(function(venta) {
      if (venta) {
        var lineas = venta.related('lineas');
        
        lineas.mapThen(function(linea) {
          prod = new lineaVenta({id:linea.get('id')}).fetch({withRelated: ['producto']}).then(function(lv){
             var prod = lv.related('producto');
             return prod;
          });
          p = linea.related('producto');
          return p.toJSON();
        }).then(function(productos){
          console.log('prods:');console.log(productos);
        });
      }
      //console.log(venta.toJSON());
    });
    return res.send({ventas:{data:ventas.toJSON()}});
  });
  */
};

exports.crear = function(req, res) {
  var nVenta = req.body;
  new Venta(nVenta).save().then(function(postedModel) {
    res.json(200,postedModel);  
  });
};

exports.addProd = function(req, res) {
  var LineaVenta  = require('../app/models/linea_venta').model;
  var Producto  = require('../app/models/producto').model;
  new Venta().query({where: {activa: true}}).fetch().then(function(venta) {
    new Producto().query({where: {id:req.params.id}}).fetch().then(function(prod) {
      if (prod != null){
        new LineaVenta({venta_id:venta.id,producto_id:prod.id,cantidad:1,precio:prod.precio}).save().then(function(lv){
          res.json(200,lv);
        });  
      }
    });
     
  });
};

exports.activar = function(req, res) {
  db = require("../sqlite3");
  var ventaId = req.params.id;
  db.run("UPDATE ventas SET activa=0",function(err){
    if (err){return res.send({ok:0});}
    else {
      db.run("UPDATE ventas SET activa=1 where id=?",ventaId,function(err){
        if (err){return res.send({ok:0});}
        else {
          return res.send({ok:1});
        }
      });
    }
  });
};

exports.borrar = function(req, res) {
  var id = req.params.id;
  db = require("../sqlite3");
  db.run("DELETE FROM ventas WHERE id=?", id, function(e) {
    if (e === null) {
      console.log('Venta con ID [' + id + '] ha sido borrada correctamente');
      db.run("DELETE FROM lineaventa WHERE venta_id=?", id, function(e) {
        if (e === null){
          console.log('Lineas de venta con ID [' + id + '] han sido borradas correctamente');
          return res.send({ok:1});
        }
        else {
          console.log('Error', e);
          return res.send({ok:0});
        }
          
      });
    } else
      return res.send({ok:0});
  });
};


