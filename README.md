# 简单博客
## 初始化项目
```
首先创建 package.json
指令：npm init -y 
```
## 安装依赖的模块
```
npm install express body-parser bootstrap connect-flash connect-mongo debug ejs express-session mongoose multer -S
```
- express  nodejs框架
- body-parser 
```
bodyParser中间件用来解析http请求体，是express默认使用的中间件之一
使用express应用生成器生成一个网站，它默认已经使用了 bodyParser.json 与 bodyParser.urlencoded的解析功,除了这两个，bodyParser还支持对text、raw的解析。
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
顾名思义，bodyParser.json是用来解析json数据格式的。bodyParser.urlencoded则是用来解析我们通常的form表单提交的数据，也就是请求头中包含这样的信息： Content-Type: application/x-www-form-urlencoded
```
###常见的四种Content-Type类型：
- application/x-www-form-urlencoded 常见的form提交
- multipart/form-data 文件提交
- application/json 提交json格式的数据
- text/xml 提交xml格式的数据

querystring就是nodejs内建的对象之一，用来字符串化对象或解析字符串
```
querystring.parse("name=henry&age=30") => { name: 'henry', age: '30' }
```
###qs介绍
qs是一个querystring的库，在qs的功能基础上，还支持更多的功能并优化了一些安全性。比如，对象解析的支持：
```
// 内建对象 querystring
querystring.parse("info[name]=henry&info[age]=30&hobby[1]=sport&hobby[2]=coding") => 
  { 
    'info[name]': 'henry',
    'info[age]': '30',
    'hobby[1]': 'sport',
    'hobby[2]': 'coding'
  }

// 第三方插件 qs
qs.parse("info[name]=henry&info[age]=30&hobby[1]=sport&hobby[2]=coding") => 
  {
    info: {
      name: 'henry',
      age: '30'
    },
    hobby: [ 'sport', 'coding' ]
  }
```
可以看出，querystring并不能正确的解析复杂对象（多级嵌套），而qs却可以做到。但是qs也不是万能的，对于多级嵌套的对象，qs只会解析5层嵌套，超出的部分会表现的跟本文头部的那种情况一样；对于数组，qs最大只会解析20个索引，超出的部分将会以键值对的形式解析。
作为一个中间件，qs必须要为性能考虑，才会有如此多的限制，express也默认使用qs来解析请求体。
理论上来说，form表单提交不会有多级嵌套的情况，而urlencoded本身也是form的内容类型，因此，bodyParser.urlencoded不支持多级嵌套也是很合理的设计。

那么，如果我们非要上传一个十分复杂的对象，应该怎么办？
###解决方案
出现这个问题的根本原因是：我以form的形式去提交了一个json数据。
jquery默认的 content-Type 配置的是 application/x-www-form-urlencoded ，
因此更改ajax请求参数： contentType: "application/json" ，并将数据转成json提交，问题就解决了。
```
// 浏览器端post一个对象
$.ajax({
    url: "/save",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify({
        name: "henry",
        age: 30,
        hobby: [ "sport", "coding" ]
    })
});

// express接收这个对象
router.post("/save", function (req, res, next) {
    console.log(req.body); // => { name: 'henry', age: 30, hobby: [ 'sport', 'coding' ] }
});
```
- connect-flash
- connect-mongo
- debug
- ejs
- express-session
- mongoose  封装mongdb数据库方法
- multer

## 配置路由
### 用户管理
- 用户注册
- 用户登录
- 用户退出

### 文章分类管理
- 创建分类
- 分类列表
- 删除分类

### 文章管理
- 创建文章
- 修改文章
- 删除文章
- 查询文章
- 评论文章

##　实现路由
### 用户路由
```
/user/signup 注册
/user/signin 登录
/user/signout 退出
```
### 文章分类路由
```
/category/list 分类列表
/category/add 增加分类
/category/delete/:id 删除分类
```
### 文章路由
```
/article/add 增加文章
/article/delete/:id 删除文章
```
### 路由实现
##### 在server.js
```
let express = require("express");
let index = express.require("./router/index");//里面的路径就是指路由文件夹相对与当前的server.js的相对路径
let app = express(); //创建一个app实例
app.user("/",index);//调取index路由
app.lisen(8000);//开启端口号
```
##### 在routes/index.js
```
let express = require("express");
let router = express.Router();//创建路由
router.get("/",function(req,res){
  res.render("index",{title:'首页'});  //render是将渲染页面
});
module.exports = router;//发出路由
```
## 数据库结构
### 用户集合
|字段名称|字段名|字段类型|
|:----|:----|:----|
|用户名|username|字符串|
|密码|password|字符串|
|邮箱|email|字符串|
|头像|avatar|字符串|

### 文章分类集合
|字段名称|字段名|字段类型|
|:----|:----|:----|
|分类名称|name|字符串|

### 文章集合
|字段名称|字段名|字段类型|
|:----|:----|:----|
|文章标题|title|字符串|
|文章内容|content|字符串|
|作者|author|ID类型|
|发表时间|createAt|日期|

## 引入ejs模板引擎
```
线引入路劲模块path
let path = require('path');
引入ejs模板引擎
app.set('view engine','html);
模板存放的路劲
app.set('view', path.resolve('views));//views 指存放html文件夹
设置模板是html，使用ejs模板引擎的渲染方法渲染
app.engine('html'require('ejs').__express）;
```




















