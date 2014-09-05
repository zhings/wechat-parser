
var parseString = require('xml2js').parseString;
var lowercase = false;
var original = false;

exports.middleware = middleware;
exports.parse = parse;


exports.lowercase = function(bool) {
  if (!arguments.length) return lowercase;
  lowercase = Boolean(bool);
};

exports.original = function(value) {
  if (!arguments.length) return original;
  original = typeof value === 'string' ? value.trim() : false;
};


function middleware(body) {
  var where = typeof body === 'string' ? body : 'weixin';
  return function wechatParser(req, res, next) {
    var method = req.method.toLowerCase();
    if (method !== 'post') return next();
    parse(req, function(err, message) {
      if (!req[where]) req[where] = {};
      if (!err && message) req[where] = message;
      if (err) console.error(err.stack || err.toString());
      return next();
    });
  };
}


function parse (stream, callback) {
  loadstream(stream, function(err, xml) {
    if (err) return callback(err);
    if (original) stream[original] = xml;
    parsexml(xml, function(err, data) {
      if (err) return callback(err);
      normalize(data, callback);
    });
  });
}


function loadstream(stream, callback) {
  var chunks = [];
  var size = 0;
  stream.on('data', function(chunk) {
    chunks.push(chunk);
    size += chunk.length;
  });
  stream.on('end', function() {
    var buf = Buffer.concat(chunks, size);
    callback(null, buf.toString());
  });
  stream.once('error', callback);
}


function parsexml(xml, callback) {
  parseString(xml, {trim: true}, callback);
}


function normalize (data, callback) {
  var isEmpty = function(arg) {
    if (!arg) return true;
    return typeof arg === 'object' && !Object.keys(arg).length;
  };
  var result = {}, key, val;
  try {
    for (key in data.xml) {
      val = data.xml[key][0];
      if (lowercase) key = key.toLowerCase();
      result[key] = isEmpty(val) ? '' : val;
    }
  } catch (err) {
    return callback(err);
  }
  callback(null, result);
}