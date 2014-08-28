
var parseString = require('xml2js').parseString;
var BufferHelper = require('bufferhelper');


module.exports = function (req, res, next) {
  var method = req.method.toLowerCase();
  if (method !== 'post') return next();
  parser(req, function (err, result) {
    if (err) return next(err);
    req.weixin = result;
    next();
  });
};


module.exports.parser = parser;


function parser (stream, callback) {
  load(stream, function (err, xml) {
    if (err) return callback(err);
    stream.weixin_xml = xml;
    parse(xml, callback);
  });
}


function load (stream, callback) {
  var helper = new BufferHelper();
  helper.load(stream, function (err, buf) {
    if (err) return callback(err);
    var xml = buf.toString('utf-8');
    callback(null, xml);
  });
}


function parse (xml, callback) {
  parseString(xml, {trim: true}, function (err, result) {
    if (err) return callback(err);
    try {
      result = format(result);
    } 
    catch (e) {
      return callback(e);
    }
    callback(null, result);
  });
}


function format (message) {
  var result = {}, key, val;

  function isEmpty (arg) {
    if (!arg) return true;
    return typeof arg === 'object' && !Object.keys(arg).length;
  }

  for (key in message.xml) {
    val = message.xml[key][0];
    result[key] = isEmpty(val) ? '' : val.trim();
  }

  return result;
}