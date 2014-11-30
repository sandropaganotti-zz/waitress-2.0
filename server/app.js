var express = require('express'),
    mongoose = require('mongoose'),
    app = module.exports = express(),
    configure = require('./config/env'),
    sse = require('./lib/connect-mongoose-sse'),
    util = require('util'),
    async = require('async'),
    http = require('http'),
    Primus = require('primus')

var Dish = require('./models/dish'),
    Order = require('./models/order')

var server = http.createServer(app),
    primus = new Primus(server, {transformer: 'websockets'})

configure(app);

app.get('/hello', function(req, res) {
  res.end(
    util.format('Hello %s', req.query.who || 'World')
  )
})

app.get('/dishes', function(req, res) {
  Dish.find().exec(function(err, docs) {
    res.json(docs)
  })
})

app.post('/orders', function(req, res) {
  Order.save(req.body, function(err, order) {
    res.location(util.format('/order/%s', order.id))
    res.status(201).json(order)
  })
})

app.get('/orders', sse(Order), function(req, res) {
  Order.find(function(err, orders) {
    res.json(orders)
  })
})

app.get('/orders/:id', function(req, res) {
  Order.findById(req.params.id, function(err, order) {
    res.json(order)
  })
})

app.post('/orders/ready', function(req, res) {
  async.map(
    req.body,
    function(orderId, done) {
      Order.findById(orderId, function(err, order) {
        if (err) {
          return done()
        }
        order.allDishesAreReady().save(done)
      })
    },
    function(err, all) {
      res.status(204).send()
    }
  )
})

app.use(express.static(__dirname +
  (process.env.NODE_ENV === 'dist' ? '/../client-dist' : '/../client')
));

Order.on('changed:ready', function(order) {
  if (order.ready) {
    primus.write({orders: [order.id]})
  }
})

if (require.main === module) {
  mongoose.connect(app.get('db'), function() {
    require('./lib/fixtures').load(mongoose.connection.db, function() {
      server.listen(app.get('port'), function() {
        console.log('Waitress server is running on port %d', app.get('port'))
      })
    })
  })
}

