let mongoose = require('mongoose');
// 引入 mongoose 模块
let conn = mongoose.createConnection('mongodb://127.0.0.1/node-project');//连接数据库
//创建用户
exports.User = conn.model('User',new mongoose.Schema({
    username: String,//用户名
    password: String,//密码
    email: String,//邮箱
    avatar: String//头像
}));