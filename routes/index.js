let express = require('express');
let router = express.Router();//路由
let {Article} = require('../model');
let {checkLogin} = require('../authware');
router.get('/',checkLogin,function (req,res) {
    let author = req.session.user._id;
    Article.find({author:author}).populate('author').exec(function (err,articles) {
        console.log(articles);
        res.render('index',{title:'首页',articles});
    });
});
module.exports = router; //export出去