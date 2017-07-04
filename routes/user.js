let express = require("express");
let router = express.Router();
router.get('/signin',function (req,res) {
    res.send("登录");
});
router.get('/signup',function (req,res) {
    res.send("注册");
})
module.exports = router;