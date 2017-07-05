let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let index = require('./routes/index');//引用index路由
let user = require('./routes/user'); //引用user路由
let article = require('./routes/article');//引入文章模块
let category = require('./routes/category');//引入分类目录
let app = express();
//引入body-parser中间件后会往请求对象上增加一个body属性
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//设置模板引擎（engine 发动机）
app.set('view engine','html');
//模板存放路径
app.set('views',path.resolve('views'));
//设置模板是html的话，使用ejs引擎的渲染方法来进行渲染
app.engine('html',require('ejs').__express);
app.use(express.static('node_modules'));
app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.use('/category',category);
app.listen(8000);
