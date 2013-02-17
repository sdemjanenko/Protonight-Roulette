var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var app = express();
var PORT = 3000;

app.set('title', 'Protonight-Roulette');

app.use(express.static(__dirname + '/public'));
app.use(express.logger());


// Routes stuff
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/user/:id', function(req, res) {
  res.send('user ' + req.params.id);
});

app.get('/meeting/:id', function(req, res) {
  res.send('meeting ' + req.params.id);
});

app.post('/meeting/:meeting_id/user/:user_id', function(req, res) {
  res.send('modifying user state for meeting ' + req.params.meeting_id + ":" + req.params.user_id);
});


app.listen(PORT);
