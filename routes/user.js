let express = require("express");
let router = express.Router();
let {User} = require('../model');
let {checkLogin,checkNotLogin} = require('../authware');
let multer = require('multer');
//dest 用来指定上传的文件存放的目录
//此文件路径应该是相对于server.js所在目录
//也就是说相对于启动的入口文件
let upload = multer({dest:'./public'});


router.get('/signup',checkNotLogin,function (req,res) {
    res.render('user/signup',{title:'注册'});
});
router.post('/signup',checkNotLogin,upload.single('avatar'),function(req,res) {
    //avatar 是表单中的input=file元素的name属性
    //req.file 指的是上传的文件信息 req.body 包含文本字段
    let user = req.body;
    user.avatar = `/${req.file.filename}`;
    User.findOne({username:user.username},function (err,oidUser) {
        if(err){
            req.flash('error',err);
            res.redirect("back");
        }else{
            if(oidUser){
                req.flash('error','这个用户名已经有人用过了，请换一个吧');
                res.redirect('back');
            }else{
                User.create(user,function (err,doc) {
                    if(err){
                        res.redirect("back");
                    }else{
                        res.redirect('/user/signin');
                    }
                });
            }
        }
    });
});
router.get('/signin',checkNotLogin,function (req,res) {
    res.render('user/signin',{title:'登录'});
});
router.post('/signin',checkNotLogin,function (req,res) {
    let user = req.body;
    User.findOne(user,function (err,doc) {
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }else{
            if(doc){
                req.flash('success','恭喜你登录成功');
                req.session.user = doc;
                res.redirect('/');
            }else{
                req.flash('error','登录失败');
                res.redirect('back');
            }
        }
    });
});

router.get('/signout',checkLogin,function(req,res){
    req.session.user = null;
    res.redirect('/user/signin');
});
module.exports = router;