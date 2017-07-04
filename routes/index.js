let express = require('express');
let router = express.Router();//路由
router.get('/',function (req,res) {
    res.send("首页111");
});
module.exports = router; //export出去