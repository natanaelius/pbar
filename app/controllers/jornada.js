/*
 * GET home page.
 */
var Jornada  = require('../models/jornada').model;

exports.ver = function(req, res) {
  if (typeof req.user != 'undefined'){
    new Jornada()
      .query({where:{activa:1}}) 
      .fetch() //{withRelated: ['prod_servido','prod_ingresado']})
      .then(function(model) {
        if (model===null) return res.render('inicio', { title: 'PBar' , usuario: req.user}); 
        else {
          req.session.jornada = model.get('id');
          res.redirect('/');
        }
    });
  } else {
    res.redirect('/login');
  }  
};

exports.crear = function(req, res) {
  if (typeof req.user != 'undefined'){
     new Jornada()
      .query({where:{activa:1}}) 
      .fetch() //{withRelated: ['prod_servido','prod_ingresado']})
      .then(function(model) {
        if (model===null){
          var j = {
            creador: req.user.id,
            estado: 'abierta',
            activa: true,
            ts: new Date()
          };
          new Jornada(j).save().then(function(jor) {
            //activar(venta.id,function(data){
              //return res.json(200,{key:'nuevaJor',jor:jor,msj:{ok:'Nueva jornada ingresada con éxito.'}});
              return res.redirect('/');
            //});
              
          });
        } 
        else {
          req.session.jornada = model.get('id');
          return res.json(200,{key:'verJor',msj:{error:'Ya existe una jornada activa'}}); 
        }
    });
  } else {
    res.redirect('/login');
  } 
};

exports.terminar = function(req, res) {
  if (typeof req.user != 'undefined'){
    new Jornada()
      .query({where:{activa:1}}) 
      .fetch() //{withRelated: ['prod_servido','prod_ingresado']})
      .then(function(model) {
        if (model===null) return res.json(200,{key:'verJor',msj:{error:'No existe jornada activa'}}); 
        else {
          delete req.session.jornada;
          model.set({activa:false});
          model.save();
          return res.render('fin_jor',{jor:model.toJSON()});
        }
    });
  } else {
    res.redirect('/login');
  } 
};
