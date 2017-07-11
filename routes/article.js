let express = require("express");
let router = express.Router();
let {checkLogin} = require('../authware');
let {Article, Category} = require('../model');
router.get('/add',checkLogin,function (req,res) {
   Category.find({},function (err,categories) {
      if(err){
         res.send('获取文章分类失败');
      }else{
         res.render('article/add',{title:'添加文章',categories,article:{}});
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
      res.render('article/detail',{title:'文章预览',article});
   });
});
//文章编辑
router.get('/update/:id',function (req,res) {
   let id = req.params.id;
   Category.find({},function (err,categories) {
        Article.findById(id,function (err,article) {
           if(err)
               return res.back(err);
            res.render('article/add',{title:'文章编辑',categories,article});
        });
   });
});
//文章编辑提交
router.post('/update/:id',function (req,res) {
   let _id = req.params.id;
   let article = req.body;
   Article.update({_id},article,function (err,result) {
      if(err){
          res.back(err);
      }else{
          res.success('文章编辑成功',`/article/detail/${_id}`);
      }
   });
});
//文章删除
router.get('/delete/:id',function (req,res) {
    let _id = req.params.id;
    Article.remove({_id},function (err,result) {
        if(err){
            res.back(err);
        }else{
            res.success('该文章删除成功','/');
        }
    })
})
module.exports = router;