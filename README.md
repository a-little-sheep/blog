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

bodyParser中间件用来解析http请求体，是express默认使用的中间件之一
使用express应用生成器生成一个网站，它默认已经使用了 bodyParser.json 与 bodyParser.urlencoded的解析功,除了这两个，bodyParser还支持对text、raw的解析。
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
顾名思义，bodyParser.json是用来解析json数据格式的。bodyParser.urlencoded则是用来解析我们通常的form表单提交的数据，也就是请求头中包含这样的信息： Content-Type: application/x-www-form-urlencoded

### 常见的四种Content-Type类型：
- application/x-www-form-urlencoded 常见的form提交
- multipart/form-data 文件提交
- application/json 提交json格式的数据
- text/xml 提交xml格式的数据

querystring就是nodejs内建的对象之一，用来字符串化对象或解析字符串
```
querystring.parse("name=henry&age=30") => { name: 'henry', age: '30' }
```
### qs介绍
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
### 解决方案
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
- express-session
- connect-mongo
- connect-flash
```
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
//使用会话中间件
app.use(session({
  resave:true,//每次请求结束重新保存session
  saveUninitialized:true,//保存未初始化的session
  secret:'zfpx',//加密cookie的秘钥
  //指定session数据的存放位置，可能是内存、文件系统、数据库
  store:new MongoStore({url:'mongodb://127.0.0.1/201703blog'})
}));
//所有的中间件都是一个函数，所以都需要执行一下再放到use里
app.use(flash());
//使用此中间件之后 req.flash();
// req.flash(type,msg) 二个参数写入一条消息
// req.flash(type) 一个参数表示读取一条消息
/**
 * ？ 如何控制页面上的菜单显示
 * 1. 当登录成功之后，会把查询到的当前用户对象保存到会话对象中 req.session
 * 2. 在渲染其它页面时，先把会话对象(req.session)中的user属性取出来赋给了res.locals(真正渲染模板的数据对象).
 * .在模板里就可以通过user有没有值来控制 菜单的显示 。
 */
app.use(function(req,res,next){
  // res.locals 是真正渲染模板的数据对象
 res.locals.user = req.session.user;
 res.locals.success = req.flash('success').toString();
 res.locals.error = req.flash('error').toString();
 next();
});
app.use(function(req,res,next){
  res.success = function(msg,url){
    req.flash('success',msg);
    res.redirect(url);
  }
  res.error = function(err,url){
    req.flash('error',err);
    res.redirect(url);
  }
  res.back = function(err){
    res.error(err.toString(),'back');
  }
  next();
});

```

- debug
- ejs
- mongoose  封装mongdb数据库方法
- multer
### multer是指模块文件上传
```
let multer = require('multer'); //引入multer 文件保存插件
let upload = multer({dest:'./public'});//dest 用来指定上传的文件存放的目录
//此文件路径应该是相对于server.js所在目录
//也就是说相对于启动的入口文件
这个模块form中必须指定是enctype="multipart/form-data"这样的设置
然后就是在 post中 function(req,res){}前添加 upload.single('avatar')
//avatar 是指 form中的input[file]元素的name=的值
//req.file 指的是上传的文件信息 req.body 包含文本字段
获取上传的图片（文件）的路径 `/${req.file.filename}`;
```
  
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
#### 在server.js
```
let express = require("express");
let index = express.require("./router/index");//里面的路径就是指路由文件夹相对与当前的server.js的相对路径
let app = express(); //创建一个app实例
app.user("/",index);//调取index路由
app.lisen(8000);//开启端口号
```
#### 在routes/index.js
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



## res.render , res.redirect , res.send 
```
res.render 是用来渲染那个页面
res.redirect 是用来修改导航条中的访问路劲
res.send 是用来返回数据的 是express写法
res.end 是node原声写法
```















