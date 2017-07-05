let express = require("express");
let router = express.Router();
router.get('/signup',function (req,res) {
    res.render('user/signup',{title:'注册'});
});
router.post('/signup',function (req,res) {
   console.log(req.body);
});
router.get('/signin',function (req,res) {
    res.render('user/signin',{title:'登录'});
});
router.get('/signout',function (req,res) {
    res.render('user/signout',{title:'退出'});
});
module.exports = router;