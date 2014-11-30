var favicon = require('serve-favicon'),
    parseBodyWhen = require('body-parser'),
    logger = require('morgan'),
    cors = require('cors');

module.exports = function(app) {
  app.use(parseBodyWhen.json());
  app.use(parseBodyWhen.urlencoded({extended: false}));
  app.use(favicon(__dirname + '/../public/favicon.ico'));

  switch(process.env.NODE_ENV) {
    case 'test':
      app.set('port', 9191);
      app.set('db', 'mongodb://localhost/waitress-test');
      break;
    default:
      app.use(cors());
      app.use(logger('combined'));
      app.set('port', process.env.PORT || 3000);
      app.set('db',
               process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
              'mongodb://localhost/waitress');
  }
};
