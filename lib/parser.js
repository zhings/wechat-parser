
var parseString = require('xml2js').parseString;


var lowercase = false;
var dataProp = 'body';


module.exports = middleware;
module.exports.parse = parse;
module.exports.middleware = middleware;


function middleware(options) {
  var opts = options || {};
  lowercase = !!opts.lowercase;
  if (typeof opts.dataProp === 'string') {
    dataProp = opts.dataProp;
  }

  return function wechatParser(req, res, next) {
    if (req._body) return next();
    var method = req.method.toLowerCase();
    if (method !== 'post') return next();
    parse(req, function(err, message) {
      if (err) {
        console.error(err.stack || err.toString());
        return next();
      }
      req._body = true;
      req[dataProp] = message || {};
      next();
    });
  }
}


function parse(stream, callback) {
  if (stream._parsedWechat) {
    return callback(null, stream._parsedWechat);
  }
  loadstream(stream, function(err, xml) {
    if (err) return callback(err);
    parseString(xml, function(err, data) {
      if (err) return callback(err);
      try {
        data = normalize(data);
      } catch (e) {
        return callback(e);
      }
      stream._parsedWechat = data;
      callback(null, data);
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


function normalize(data) {
  var result = {};
  Object.keys(data.xml).forEach(function(key) {
    var value = data.xml[key][0];
    if (lowercase) key = key.toLowerCase();
    result[key] = isEmpty(value) ? '' : value;
  });
  return result;
}


function isEmpty(value) {
  if (!value) return true;
  return typeof value === 'object' && !Object.keys(value).length;
}