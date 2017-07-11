let express = require('express');
let router = express.Router();
let {Category} = require('../model');
let {checkLogin} = require('../authware');
router.get('/add',checkLogin,function (req,res) {
    res.render('category/add',{title:'添加分类'});
});
router.post('/add',checkLogin,function (req,res) {
   let category = req.body;
   Category.findOne(category,function (err,oldCategory) {
       if(err){
           req.flash('error',err);
           res.redirect("back");
       }else{
           if(oldCategory){
               req.flash('error','分类名称已经存在，请换个名称吧');
               res.redirect("back");
           }else{
               Category.create(category,function (err,doc) {
                   if(err){
                       res.back(err);
                   }else{
                       res.success('分类添加成功','/category/list');
                   }
               })
           }
       }
   })
});
router.get('/list',checkLogin,function (req,res) {
    Category.find({},function (err,categories){
        if(err){
            req.flash('error',err);
        }else{
            res.render('category/list',{title:'分类列表',categories});
        }
    })
});
module.exports = router;