let express = require("express");
let router = express.Router();
let {checkLogin} = require('../authware');
let {Article, Category} = require('../model');
router.get('/add',checkLogin,function (req,res) {
   Category.find({},function (err,categories) {
      if(err){
         res.send('获取文章分类失败');
      }else{
         res.render('article/add',{title:'添加文章',categories});
      }
   });
});
router.post('/add',checkLogin,function (req,res) {
   let article = req.body;
   article.author = req.session.user._id;
   Article.create(article,function(err,doc){
      if(err){
         res.back(err);
      } else {
         res.success('文章发表成功', '/');
      }
   });
});
//文章详情
router.get('/detail/:id',checkLogin,function(req,res) {
   let id = req.params.id;
   Article.findById(id).populate('category').exec(function (err,article) {
      res.render('article/detail',{title:'文章编辑',article});
   });
});
//文章编辑
router.get('/update/:id',function (req,res) {
   let id = req.params.id;
   Article.f
});
module.exports = router;