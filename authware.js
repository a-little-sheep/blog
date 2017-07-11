//要求当前用户必须登录后才能访问
exports.checkLogin = function (req,res,next) {
    if(req.session.user){
        next();
    }else{
        res.redirect('/user/signin');
    }
}
exports.checkNotLogin = function (req,res,next) {
    if(req.session.user){//如果已经登录了，则跳转到首页 /
        res.redirect('/');
    }else{
        next();//执行下一个中间件或者路由
    }
}