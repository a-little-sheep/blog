let express = require('express');
let router = express.Router();//路由
router.get('/',function (req,res) {
    res.render('index',{title:'首页'});
});
module.exports = router; //export出去