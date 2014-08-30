
/*
 * GET home page.
 */
var _ = require('underscore-node');

var Ventas = require('../app/collections/ventas').collection;
var Venta  = require('../app/models/venta').model;
var lineas  = require('../app/collections/lineas').collection;

exports.list = function(req, res) {
  new Ventas()
    .query(function(qb){qb.orderBy('activa','DESC');})
    .fetch({withRelated: ['prod_servido','prod_ingresado']})
    .then(function(collection) {
    var ventas=collection.toJSON();
    ventas = calc_subtotal(ventas);
    return res.json(200,{key:'listaVentas',ventas:ventas});  
  });
};

exports.crear = function(req, res) {
  var nVenta = req.body;
  new Venta(nVenta).save().then(function(venta) {
    //activar(venta.id,function(data){
      return res.json(200,{key:'nuevaVenta',venta:venta});
    //});
      
  });
};

exports.addProd = function(req, res) {
  var LineaVenta  = require('../app/models/linea').model;
  var Producto  = require('../app/models/producto').model;
  new Venta().query({where: {activa: true}}).fetch().then(function(venta) {
    new Producto().query({where: {id:req.params.id}}).fetch({withRelated: ['lineas_ns']}).then(function(prod) {
      if (prod != null){
        var en_lineas = prod.related('lineas_ns');
        var linea = {
          venta_id:venta.id,
          producto_id:prod.id,
          cantidad:1,
          precio:prod.get('precio'),
          estado:'ingresado',
          ts:new Date()
        };
        if (!_.isEmpty(en_lineas)){
          console.log('en_lineas: ');console.log(en_lineas.toJSON());
          aux = _.where(en_lineas.toJSON(), {venta_id:venta.id});
          console.log(aux);
          if (!_.isEmpty(aux)){
            linea.cantidad=aux[0].cantidad+1;
            linea.id=aux[0].id;
          }
        }
        new LineaVenta(linea).save().then(function(lv){
          new Venta({id:venta.id}).fetch({withRelated: ['prod_servido','prod_ingresado']}).then(function(model) {
            var venta=model.toJSON();
            venta = calc_subtotal([venta]);
            console.log(venta);
            res.json(200,{key:'addProd',venta:venta[0]});
          });  
        });
      }
    });
     
  });
};

exports.activar = function(req, res) {
  activar(req.params.id,function(resp){
    return res.json(200,{key:'actVenta',ok:resp});
  });
};

exports.borrar = function(req, res) {
  var id = req.params.id;
  db = require("../sqlite3");
  db.run("DELETE FROM ventas WHERE id=?", id, function(e) {
    if (e === null) {
      console.log('Venta con ID [' + id + '] ha sido borrada correctamente');
      db.run("DELETE FROM lineas WHERE venta_id=?", id, function(e) {
        if (e === null){
          console.log('Lineas de venta con ID [' + id + '] han sido borradas correctamente');
          return res.json(200,{key:'delVenta',ok:true});
        }
        else {
          console.log('Error', e);
          return res.json(200,{key:'delVenta',ok:false});
        }
          
      });
    } else
      return res.json(200,{key:'delVenta',ok:false});
  });
};

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
  return _.map(arr,function(v){
          tserv=_.isEmpty(v.prod_servido) ? 0 : _.reduce(v.prod_servido, function(memo, p){ return memo + p.total; }, 0);
          ting=_.isEmpty(v.prod_ingresado) ? 0 : _.reduce(v.prod_ingresado, function(memo, p){ return memo + p.total; }, 0);
          v.total_venta = ting+tserv;
          return v;
        });
  //return callback(resp);
}

function activar(id,cb){
  db = require("../sqlite3");
  var ventaId = id;
  db.run("UPDATE ventas SET activa=0",function(err){
    if (err){return cb(false);}
    else {
      db.run("UPDATE ventas SET activa=1 where id=?",ventaId,function(err){
        if (err){return cb(false);}
        else {
          return cb(true);
        }
      });
    }
  });
}
