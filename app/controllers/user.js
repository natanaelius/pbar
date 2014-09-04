
var Users = require('../collections/users').collection;
var User = require('../models/user').model;

exports.login = function(req, res){
  if (req.method === 'GET') {
    return res.render('login', {
      title : 'Inicia sesión'
    });
  }
};

exports.list = function(req, res){
	new Users().fetch({
		withRelated: ['ventas']
	}).then(function(collection) {
		res.send(collection.toJSON());
	}); 
};
