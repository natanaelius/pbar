/*
 * GET home page.
 */
var _ = require('underscore-node');

var Ventas = require('../collections/ventas').collection;
var Venta = require('../models/venta').model;
var LineaVenta = require('../models/linea').model;
var lineas = require('../collections/lineas').collection;
var Producto = require('../models/producto').model;
var Jornada = require('../models/jornada').model;

exports.ver = function(req, res) {
  if ( typeof req.user != 'undefined') {
    new Venta({
      id : req.params.id
    }).fetch({
      withRelated : ['prod_servido', 'prod_ingresado']
    }).then(function(model) {
      if (model === null)
        return res.json(200, {
          key : 'verVenta',
          msj : {
            error : 'Venta no existe'
          }
        });
      else {
        var venta = model.toJSON();
        aux = calc_subtotal([venta]);
        return res.json(200, {
          key : 'verVenta',
          venta : aux[0]
        });
      }
    });
  } else {
    return res.json(200, {
      msj : {
        error : 'No se ha iniciado la sesión <a href="/login">Iniciar</a>'
      }
    });
  }

};

exports.list = function(req, res) {
  if ( typeof req.session.jornada != 'undefined'){
    new Jornada()
      .query({where:{activa:1}}) 
      .fetch()
      .then(function(model) {
        if (model===null) return res.json(200,{key:'listaVentas',msj:{error:'No existe jornada activa'}}); 
        else {
          req.session.jornada = model.get('id');
        }
    });
  } 
  if ( typeof req.user != 'undefined') {
    new Ventas().query(function(qb) {
      qb.where({jornada_id : req.session.jornada});
      qb.orderBy('activa', 'DESC');
    }).fetch({
      withRelated : ['prod_servido', 'prod_ingresado']
    }).then(function(collection) {
      var ventas = collection.toJSON();
      ventas = calc_subtotal(ventas);
      return res.json(200, {
        key : 'listaVentas',
        ventas : ventas
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

exports.crear = function(req, res) {
  if ( typeof req.user != 'undefined') {
    var nVenta = {
      jornada_id : req.session.jornada,
      nombre : req.body.nombre,
      usuario_id : req.user.id,
      estado : 'abierta',
      activa : 0,
      ts : new Date()
    };
    new Venta(nVenta).save().then(function(venta) {
      console.log(venta.toJSON());
      return res.json(200, {
        key : 'nuevaVenta',
        venta : venta.toJSON(),
        msj : {
          ok : 'Nueva venta ingresada con éxito.'
        }
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

exports.addProd = function(req, res) {
  if ( typeof req.user != 'undefined') {
    new Venta().query({
      where : {
        activa : true
      }
    }).fetch().then(function(venta) {
      if (venta === null) {
        return res.json(200, {
          key : 'addProd',
          msj : {
            error : 'No hay ninguna venta activa'
          }
        });
      } else {
        new Producto().query({
          where : {
            id : req.params.id
          }
        }).fetch({
          withRelated : ['lineas_ns']
        }).then(function(prod) {
          if (prod != null) {
            var en_lineas = prod.related('lineas_ns');
            var linea = {
              venta_id : venta.id,
              producto_id : prod.id,
              cantidad : 1,
              precio : prod.get('precio'),
              estado : 'ingresado',
              ts : new Date()
            };
            if (!_.isEmpty(en_lineas)) {
              console.log('en_lineas: ');
              console.log(en_lineas.toJSON());
              aux = _.where(en_lineas.toJSON(), {
                venta_id : venta.id
              });
              console.log(aux);
              if (!_.isEmpty(aux)) {
                linea.cantidad = aux[0].cantidad + 1;
                linea.id = aux[0].id;
              }
            }
            new LineaVenta(linea).save().then(function(lv) {
              new Venta({
                id : venta.id
              }).fetch({
                withRelated : ['prod_servido', 'prod_ingresado']
              }).then(function(model) {
                var venta = model.toJSON();
                venta = calc_subtotal([venta]);
                console.log(venta);
                return res.json(200, {
                  key : 'addProd',
                  venta : venta[0]
                });
              });
            });
          }
        });
      }
    });
  } else {
    return res.json(200, {
      msj : {
        error : 'No se ha iniciado la sesión <a href="/login">Iniciar</a>'
      }
    });
  }
};

exports.servido = function(req, res) {
  if ( typeof req.user != 'undefined') {
    new LineaVenta({
      id : req.params.id
    }).fetch().then(function(linea) {
      new lineas().query({
        where : {
          venta_id : linea.get('venta_id'),
          producto_id : linea.get('producto_id')
        }
      }).fetch().then(function(lineas) {
        aux = lineas.toJSON();
        if (aux.length > 1) {
          new LineaVenta().query({
            where : {
              venta_id : linea.get('venta_id'),
              producto_id : linea.get('producto_id'),
              estado : 'servido'
            }
          }).fetch().then(function(l) {
            l.set({
              cantidad : l.get('cantidad') + linea.get('cantidad')
            });
            l.save().then(function(lv) {
              return res.json(200, {
                key : 'servido',
                linea : lv
              });
            });
            linea.destroy();
          });
        } else {
          linea.set({
            estado : 'servido'
          });
          //console.log('linea');console.log(linea);
          linea.save().then(function(lv) {
            return res.json(200, {
              key : 'servido',
              linea : lv
            });
          });
        }
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

exports.activar = function(req, res) {
  if ( typeof req.user != 'undefined') {
    activar(req.params.id, function(resp) {
      return res.json(200, {
        key : 'actVenta',
        ok : resp
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

exports.borrar = function(req, res) {
  if ( typeof req.user != 'undefined') {
    var id = req.params.id, msj = '';
    new Venta({id:req.params.id}).fetch({withRelated:['lineas']}).then(function(model){
      return model.related('lineas').invokeThen('destroy').then(function () {
        return model.destroy().then(function () {
          console.log('destroyed!');
          return res.json(200, {
              key : 'delVenta',
              ok : true,
              msj : {
                ok : 'venta borrada'
              }
            });
        });
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

function calc_subtotal(arr, callback) {
  Number.prototype.formatMoney = function(c, d, t) {
    var n = this, c = isNaN( c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt( n = Math.abs(+n || 0).toFixed(c)) + "", j = ( j = i.length) > 3 ? j % 3 : 0;
    return s + ( j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ( c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };
  resp = _.map(arr, function(v) {
    v.prod_servido = _.map(v.prod_servido, function(p) {
      p.total = p._pivot_cantidad * p._pivot_precio;
      p.precio = p._pivot_precio.formatMoney(0, ',', '.');
      p.totalF = p.total.formatMoney(0, ',', '.');

      return p;
    });
    v.prod_ingresado = _.map(v.prod_ingresado, function(p) {
      p.total = p._pivot_cantidad * p._pivot_precio;
      p.precio = p._pivot_precio.formatMoney(0, ',', '.');
      p.totalF = p.total.formatMoney(0, ',', '.');
      return p;
    });
    return v;
  });
  return _.map(arr, function(v) {
    tserv = _.isEmpty(v.prod_servido) ? 0 : _.reduce(v.prod_servido, function(memo, p) {
      return memo + p.total;
    }, 0);
    ting = _.isEmpty(v.prod_ingresado) ? 0 : _.reduce(v.prod_ingresado, function(memo, p) {
      return memo + p.total;
    }, 0);
    v.total_venta = ting + tserv;
    v.total_ventaF = v.total_venta.formatMoney(0, ',', '.');
    return v;
  });
  //return callback(resp);
}

function activar(id, cb) {
  new Ventas().fetch().then(function(collection) {
    collection.mapThen(function(model) {
      model.set({
        activa : 0
      });
      return model.save().then(function() {
        return model.get('id') + '-saved';
      });
    }).then(function(resp) {
      new Venta({
        id : id
      }).fetch().then(function(vactiva) {
        vactiva.set({
          activa : true
        });
        vactiva.save();
        return cb(true);
      });
      // resp: ['1-saved', '2-saved', '3-saved']

    });
  });
}
