
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load customers route
var categories = require('./routes/categories'); 
var products = require('./routes/products');
var users = require('./routes/users');
var orders = require('./routes/orders');
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : '123',
        port : 3306, //port mysql
        database:'ecommerce'

    },'pool') //or single

);



app.get('/', routes.index);
app.get('/categories', categories.list);
app.get('/categories/add', categories.add);
app.post('/categories/add', categories.save);
app.get('/categories/delete/:id', categories.delete_category);
app.get('/categories/edit/:id', categories.edit);
app.post('/categories/edit/:id',categories.save_edit);

app.get('/products', products.list);
app.get('/products/add', products.add);
app.post('/products/add', products.save);
app.get('/products/delete/:id', products.delete_product);
app.get('/products/edit/:id', products.edit);
app.post('/products/edit/:id',products.save_edit);

app.get('/users', users.list);
app.get('/users/add', users.add);
app.post('/users/add', users.save);
app.get('/users/delete/:id', users.delete_user);
app.get('/users/edit/:id', users.edit);
app.post('/users/edit/:id',users.save_edit);

app.get('/orders', orders.list);
app.get('/orders/add', orders.add);
app.post('/orders/add', orders.save);
app.get('/orders/delete/:id', orders.delete_order);
// app.get('/orders/edit/:id', orders.edit);
// app.post('/orders/edit/:id',orders.save_edit);

app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});