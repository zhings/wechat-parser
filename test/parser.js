
var stream = require('stream');
var should = require('should');
var parser = require('..');
var parse = parser.parse;
var fs = require('fs');
var path = require('path');

describe('parse()', function() {


  it('parse text message should ok', function(done) {
    var text = path.join(__dirname, 'xmls/text.xml');
    var stream = fs.createReadStream(text);
    parse(stream, function(err, msg) {
      (err == null).should.be.true;
      msg.should.be.Object;
      msg.should.have.property('MsgId');
      msg.should.have.property('ToUserName');
      msg.should.have.property('FromUserName');
      msg.should.have.property('CreateTime');
      msg.should.have.property('MsgType', 'text');
      msg.should.have.property('Content');
      done();
    });
  });


  it('parse image message should ok', function(done) {
    var image = path.join(__dirname, 'xmls/image.xml');
    var stream = fs.createReadStream(image);
    parse(stream, function(err, msg) {
      (err == null).should.be.true;
      msg.should.be.Object;
      msg.should.have.property('MsgId');
      msg.should.have.property('ToUserName');
      msg.should.have.property('FromUserName');
      msg.should.have.property('CreateTime');
      msg.should.have.property('MsgType', 'image');
      msg.should.have.property('PicUrl');
      msg.should.have.property('MediaId');
      done();
    });
  });


  it('parse voice message should ok', function(done) {
    var voice = path.join(__dirname, 'xmls/voice.xml');
    var stream = fs.createReadStream(voice);
    parse(stream, function(err, msg) {
      (err == null).should.be.true;
      msg.should.be.Object;
      msg.should.have.property('MsgId');
      msg.should.have.property('ToUserName');
      msg.should.have.property('FromUserName');
      msg.should.have.property('CreateTime');
      msg.should.have.property('MsgType', 'voice');
      msg.should.have.property('MediaId');
      msg.should.have.property('Format');
      done();
    });
  });


  it('parse mass result event should ok', function(done) {
    var result = path.join(__dirname, 'xmls/mass_send_job_finish.xml');
    var stream = fs.createReadStream(result);
    parse(stream, function(err, msg) {
      msg.should.be.Object;
      msg.should.have.property('ToUserName');
      msg.should.have.property('FromUserName');
      msg.should.have.property('CreateTime');
      msg.should.have.property('MsgType', 'event');
      msg.should.have.property('Event', 'MASSSENDJOBFINISH');
      msg.should.have.property('Status');
      msg.should.have.property('TotalCount');
      msg.should.have.property('FilterCount');
      msg.should.have.property('SentCount');
      msg.should.have.property('ErrorCount');
      msg.should.have.property('MsgID'); // 注意：这里的MsgID有所区别
      done();
    });
  });


  it('parse badmessage should not ok', function(done) {
    var badxml = path.join(__dirname, 'xml.js');
    var stream = fs.createReadStream(badxml);
    parse(stream, function(err, msg) {
      err.should.be.ok;
      (msg == null).should.be.true;
      done();
    });
  });


  it('parse badxml should not ok', function(done) {
    var badxml = path.join(__dirname, 'xmls/bad.xml');
    var stream = fs.createReadStream(badxml);
    parse(stream, function(err, msg) {
      err.should.be.ok;
      (msg == null).should.be.true;
      done();
    });
  });


});