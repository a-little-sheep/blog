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
- express
- body-parser
- connect-flash
- connect-mongo
- debug
- ejs
- express-session
- mongoose
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
  res.send("首页");
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