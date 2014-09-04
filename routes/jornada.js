
/*
 * GET home page.
 */
var Jornada  = require('../app/models/jornada').model;


exports.ver = function(req, res) {
  new Jornada()
    .query({where:{activa:1}}) 
    .fetch() //{withRelated: ['prod_servido','prod_ingresado']})
    .then(function(model) {
      if (model===null) return res.json(200,{key:'verJor',msj:{error:'No existe jornada activa'}}); 
      else {
        req.session.jornada = model.get('id');
        return res.json(200,{key:'verJor',jor:model.toJSON()});
      }
  });
};

exports.crear = function(req, res) {
   new Jornada()
    .query({where:{activa:1}}) 
    .fetch() //{withRelated: ['prod_servido','prod_ingresado']})
    .then(function(model) {
      if (model===null){
        var j = {
          estado: 'abierta',
          activa: true,
          ts: new Date()
        };
        new Jornada(j).save().then(function(jor) {
          //activar(venta.id,function(data){
            return res.json(200,{key:'nuevaJor',jor:jor,msj:{ok:'Nueva jornada ingresada con éxito.'}});
          //});
            
        });
      } 
      else {
        req.session.jornada = model.get('id');
        return res.json(200,{key:'verJor',msj:{error:'Ya existe una jornada activa'}}); 
      }
  });
        
};
