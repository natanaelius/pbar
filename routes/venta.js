
/*
 * GET home page.
 */
var _ = require('underscore-node');

var Ventas = require('../app/collections/ventas').collection;
var Venta  = require('../app/models/venta').model;
var lineas  = require('../app/collections/lineas').collection;

exports.list = function(req, res) {
  new Ventas().fetch({withRelated: ['prod_servido','prod_ingresado']}).then(function(collection) {
    var ventas=collection.toJSON();
    function calc_subtotal(arr,callback){
      resp =_.map(arr,function(v){
        v.prod_servido=_.map(v.prod_servido,function(p){
          p.total=p._pivot_cantidad*p._pivot_precio;
          return p;
        });
        v.prod_ingresado=_.map(v.prod_ingresado,function(p){
          p.total=p._pivot_cantidad*p._pivot_precio;
          return p;
        });
        return v;
      });
      return callback(resp);
    }
    function calc_total(arr){ 
      
    }
    ventas = calc_subtotal(ventas,function(arr){
      return _.map(arr,function(v){
          tserv=_.isEmpty(v.prod_servido) ? 0 : _.reduce(v.prod_servido, function(memo, p){ return memo + p.total; }, 0);
          ting=_.isEmpty(v.prod_ingresado) ? 0 : _.reduce(v.prod_ingresado, function(memo, p){ return memo + p.total; }, 0);
          v.total_venta = ting+tserv;
          return v;
        });
    });
    return res.send({ventas:{data:ventas}});
  });
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


