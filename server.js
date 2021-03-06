/**
 * Module dependencies.
 */

/* If you're following along, this is a good starting point.
 * But first, look inside package.json. Note that we had to grab the mysql
 * library from npm.
 * Most of this code is just scaffolding from Express.
 */

var express = require('express');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var http = require('http');
var path = require('path');

// bring in Bookshelf!
var Bookshelf = require('bookshelf');

var app = express();

// all environments
app.use(express.cookieParser());
app.use(express.session({
  secret : 'almud bar'
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Okay, this just follows the Bookshelf documentation.
 * Note that we're initializing to Bookshelf.DB. This way we can refer to the
 * initalized Bookshelf in the future, since we're only supposed to do it once
 * per app.
 *
 * (port is 8889 because I was running my DB off MAMP)
 */

Bookshelf.DB = Bookshelf.initialize({
  client : 'sqlite3',
  connection : {
    filename : './bar.sqlite3'
  },
  debug : true
});

passport.use(new LocalStrategy(function(username, password, done) {
  return check_auth_user(username, password, done);
}));

//CONTROLADORES
var user = require('./app/controllers/user');
var producto = require('./app/controllers/producto');
var venta = require('./app/controllers/venta');
var jornada = require('./app/controllers/jornada');

//RUTAS
var routes = require('./app/controllers');
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/jor', jornada.ver);
app.post('/jor/nuevo', jornada.crear);
app.get('/jor/fin', jornada.terminar);
app.get('/productos', producto.listaJson);
app.get('/lista', producto.lista);
app.get('/ventas', venta.list);
app.get('/venta/:id', venta.ver);
app.post('/venta/nuevo', venta.crear);
app.get('/venta/activar/:id', venta.activar);
app.get('/venta/addProd/:id', venta.addProd);
app.get('/linea/servido/:id', venta.servido);
app.get('/venta/borrar/:id', venta.borrar);
app.get('/producto/nuevo', producto.nuevo);
app.post('/producto/nuevo', producto.crear);
app.get('/producto/:id', producto.editar);
app.post('/producto/:id', producto.crear);
app.get('/producto/borrar/:id', producto.borrar);
app.get('/users', user.list);
app.get('/login', user.login);
app.post('/login',passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: false }));
app.get('/logout', function(req, res){  req.logout();  res.redirect('/login'); });

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

function check_auth_user(username, password, done, public_id) {
  var User = require('./app/models/user').model;
  var passGen = require('./app/password');
  new User()
      .query({where:{username:username}})
      .fetch()
      .then(function(model) {
        var user=model.toJSON();
        console.log(user);
        console.log('ok: '+passGen.validate(user.password,password));
        if (model===null || !passGen.validate(user.password,password)){
          return done(null, false);
        }   
        else {         
          passport.serializeUser(function(user, done) {
            done(null, user);
          });
          passport.deserializeUser(function(id, done) {
            done(null, user);
          });
          return done(null, user);
        }
    });
}
