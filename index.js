var express = require('express');
var Meeting = require('./routes/database').Meeting;
var app = express();
var PORT = 3000;

app.set('title', 'Protonight-Roulette');

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.logger());


// Routes stuff
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

// get the list of meetings
app.get('/meetings', function(req, res) {
  //var req_ip = req.ip; // filter the meetings by IP so that users are connected to event wifi
  Meeting.findAll(function(data) { res.send(data); });
});

// add a new meeting
app.post('/meetings', function(req, res) {
  var data = req.body;
  console.log("data", data);
  Meeting.create(data, function(meeting) { res.send(meeting); });
});

// show details for a particular meeting
app.get('/meetings/:id', function(req, res) {
  var id = req.params.id;
  Meeting.find(id, function(meeting) { res.send(meeting); });
});

app.put('/meetings/:id', function(req, res) {
  var id = req.params.id;
  var data = req.body;
  Meeting.update(id, data, function(meeting) { res.send(meeting); });
});

app.listen(PORT);
