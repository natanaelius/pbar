
/**
 * Module dependencies.
 */

/* If you're following along, this is a good starting point.
 * But first, look inside package.json. Note that we had to grab the mysql 
 * library from npm.
 * Most of this code is just scaffolding from Express.
 */

var express = require('express');

//CONTROLADORES
var routes = require('./routes');

var http = require('http');
var path = require('path');

// bring in Bookshelf!
var Bookshelf = require('bookshelf');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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
  	client: 'sqlite3',
    connection: {
        filename : './bar.sqlite3'
    },
    debug: true
  });
/*
 * Just referencing our modules, we'll go there in a moment
 */
var user = require('./routes/user');
var tweet = require('./routes/tweet');
var producto = require('./routes/producto');
var venta = require('./routes/venta');

/* These are the routes we're going to use.
 * These are fairly standard routes for a REST API. Yes, I didn't bother to 
 * finish implementing users.
 * 
 * Let's go over to the Tweet model in /app/models/tweet first.
 */

 /*
  * Once you've finished checking out all the models, look at /app/collections
  * then /routes
  */

app.get('/', routes.index);
app.get('/productos', producto.list);
app.get('/lista', producto.lista);
app.get('/ventas', venta.list);
app.post('/venta/nuevo', venta.crear);
app.get('/venta/activar/:id', venta.activar);
app.get('/venta/addProd/:id', venta.addProd);
app.get('/venta/borrar/:id', venta.borrar);
app.get('/producto/nuevo', producto.nuevo);
app.post('/producto/nuevo', producto.crear);
app.get('/producto/:id', producto.editar);
app.post('/producto/:id', producto.crear);
app.get('/producto/borrar/:id', producto.borrar);
app.get('/users', user.list);
app.get('/tweets', tweet.list);
app.post('/tweets', tweet.create);
app.get('/tweets/:id', tweet.show);
app.patch('/tweets/:id', tweet.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
