wechat-parser
============================

解析微信推送的XML消息

用法示例
----------------------------

```javascript
/**
 * 作为中间件使用
 */

var express = require('express');
var parser = require('wechat-parser');

// 默认为 false，可设置为 true，设置后所有消息对象的键名为小写
parser.lowercase(false);

// 默认为 false，设置后 req.weixin_xml 为原始XML字符串
parser.original('weixin_xml');

var app = express();
app.use(parser.middleware('weixin'));
app.use(function(req, res) {
  console.log(req.weixin);
  console.log(req.weixin_xml);
});


/**
 * 直接调用
 */

app.use(function(req, res) {
  parser.parse(req, function(err, message) {
    if (err) throw err;
    console.log(message);
  });
});
```


API 参考
----------------------------
__wechatParser.middleware([body]);__

传入可选参数`body`（`String`类型），返回解析微信推送消息的中间件函数。

__wechatParser.parse(stream, callback);__

传入数据流参数（这里一般为`req`对象），通过回调返回解析后的微信消息对象。回调函数包含`err`和`message`2个参数。

__wechatParser.lowercase(bool)__

可配置的布尔属性，默认为`false`，设置是否将将返回的消息对象的键名小写。

__wechatParser.original(name)__

将原始的XML字符串挂载到`req`请求对象上，默认为`false`，可设置为字符串。