let mongoose = require('mongoose');
// 引入 mongoose 模块
mongoose.Promise = Promise;
let ObjectId = mongoose.Schema.Types.ObjectId;
let conn = mongoose.createConnection('mongodb://127.0.0.1/node-project');//连接数据库
//创建用户
exports.User = conn.model('User',new mongoose.Schema({
    username: String,//用户名
    password: String,//密码
    email: String,//邮箱
    avatar: String//头像
}));
exports.Category = conn.model('Category',new mongoose.Schema({
    name:String //分类的名称 类型是 字符串
}));
exports.Article = conn.model('Article',new mongoose.Schema({
    title:String,
    content:{type:String},
    author:{type:ObjectId,ref:'User'},
    category:{type:ObjectId,ref:'Category'},
    createAt:{type:Date,default:Date.now}//now不要加小括号，否则就变成一个永远固定的值了
}));