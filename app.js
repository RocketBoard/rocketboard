var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var url = require('url');
var sass = require('node-sass');
var app = express();
var configurable = require('./lib/configurable');
var _ = require('underscore');


var bootstrap = function() {
  var configServer = require('./config/server.js');
  var configClient = require('./config/client.js');

  app.use(sass.middleware({
    src: __dirname + '/app',
    debug: false
  }));

  app.use(express.static('app'));

  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.get('/config', function(req, res) {
    res.send(configClient);
  });

  app.get('/request_code', function(req, res) {
    if (req.query.requestPrivateRepositories) {
      res.redirect('https://github.com/login/oauth/authorize?client_id=' + configServer.clientId + '&scope=repo');
    } else {
      res.redirect('https://github.com/login/oauth/authorize?client_id=' + configServer.clientId + '&scope=public_repo');
    }
  });

  app.get('/request_auth_token', function(req, res) {
    var getAuthTokenUrl = 'https://github.com/login/oauth/access_token?' +
      'client_id=' + configServer.clientId +
      '&client_secret=' + configServer.clientSecret +
      '&code=' + req.query.code;

    xhr = new XMLHttpRequest();
    xhr.open('POST', getAuthTokenUrl, false);
    xhr.send();

    var fakeUrl = 'http://fake.uri/?' + xhr.responseText;
    var showPrivateRepo = url.parse(fakeUrl, true).query['scope'] === 'repo';


    res.redirect('/?private_repo=' + showPrivateRepo + '#' + url.parse(fakeUrl, true).query['access_token']);
  });

  require('./lib/priorization')(app, {
    url: configServer.redisUrl
  });

  port = process.env.PORT || 3000;
  app.listen(port);
  console.log('Server started. Running on port', port);
}

configurable.verify([{
  key: 'PX_CLIENT_ID',
  description: "GitHub's application Client ID"
}, {
  key: 'PX_CLIENT_SECRET',
  description: "GitHub's application Client Secret"
}, {
  key: 'REPOS',
  description: 'Repositories list (optional)',
  optional: true
}], bootstrap);
