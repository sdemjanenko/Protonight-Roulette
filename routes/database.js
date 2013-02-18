var redis = require('redis');
var db = redis.createClient();
var _ = require('underscore')._;

// setup redis helpers
//redis.debug_mode = true;
//db.set('', '');

var dbExpire = 10; // seconds
var Meeting = {};

Meeting.findAll = function(callback) {
  var data = [];
  db.zremrangebyscore('meetings', 0, (new Date()).getTime()/1000); // clear out old keys from the meetings set
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
};

Meeting.find = function(id, callback) {
  db.hgetall("meetings/" + id, function(err, val) {
    if (err) throw err;
    callback(val);
  });
};

Meeting.create = function(attributes, callback) {
  db.incr('next_id/meetings', function(err, id) {
    var key = "meetings/" + id;
    attributes.id = id;
    db.hmset(key, attributes, function(err) {
      if (err) throw err;
      db.zadd("meetings", (new Date()).getTime()/1000 + dbExpire, key);
      db.expire(key, dbExpire); // only let the key live for 10 seconds
      callback(attributes);
    });
  });
};

Meeting.update = function(id, attributes, callback) {
  var key = "meetings/" + id;
  db.hgetall(key, function(err, val) {
    if (err) throw err;
    db.hmset(key, _.extend(val, attributes), function(err) {
      if (err) throw err;
      callback(attributes);
    });
  });
};

exports.Meeting = Meeting;
