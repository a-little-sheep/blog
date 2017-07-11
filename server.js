let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let flash = require('connect-flash');
let path = require('path');
let index = require('./routes/index');//引用index路由
let user = require('./routes/user'); //引用user路由
let article = require('./routes/article');//引入文章模块
let category = require('./routes/category');//引入分类目录
let app = express();
//引入body-parser中间件后会往请求对象上增加一个body属性
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'zfpx',
    store:new MongoStore({url:'mongodb://127.0.0.1/node-project'})
}));
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
//设置模板引擎（engine 发动机）
app.set('view engine','html');
//模板存放路径
app.set('views',path.resolve('views'));
//设置模板是html的话，使用ejs引擎的渲染方法来进行渲染
app.engine('html',require('ejs').__express);
app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.use('/category',category);
app.listen(5000);
