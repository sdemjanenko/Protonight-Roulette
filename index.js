var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var app = express();
var PORT = 3000;

app.set('title', 'Protonight-Roulette');

app.use(express.static(__dirname + '/public'));
app.use(express.logger());


// setup redis helpers
//redis.debug_mode = true;
//db.set('', '');


// Routes stuff
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

// get the list of meetings
app.get('/meetings', function(req, res) {
  //var req_ip = req.ip; // filter the meetings by IP so that users are connected to event wifi
  fetchMeetings(function(data) { res.send(data); });
});

function fetchMeetings(callback) {
  var data = [];
  db.zremrangebyscore('meetings', 0, (new Date()).getTime()); // clear out old keys from the meetings set
  db.zrevrangebyscore([ 'meetings', "+inf", "-inf" ], function(err, res) {
    if (err) throw err;
    res = res || [];
    if (res.length === 0)
      callback([]);
    else {
      res.forEach(function(key) {
        db.hgetall(key, function(err, val) {
          if (err) throw err;
          data.push(val);
          if (data.length === res.length)
            callback(data);
        });
      });
    }
  });
}

// add a new meeting
app.post('/meetings', function(req, res) {
  //var data = req.body;
  var data = {
      title: "test1",
      skills: ['ideas', 'developer', 'designer'],
      count: 0
  };

  db.incr('next_id/meetings', function(err, id) {
    var key = "meetings/" + id;
    console.log('key', key, data);
    db.hmset(key, data, function(err) {
      db.zadd("meetings", (new Date()).getTime() + 10000, key);
      db.expire(key, 10); // only let the key live for 10 seconds
    });
  });

  res.send(data);
});

// show details for a particular meeting
app.get('/meeting/:id', function(req, res) {
  var id = req.params.id,
      data = {};

  if (id === 1) {
    data = {
      id: 1,
      title: "test1",
      skills: ['ideas', 'developer', 'designer'],
      members: ['Steve', 'Ben', 'Brian']
    };
  }

  res.send(data);
});

app.listen(PORT);
