var express = require('express');

exports.home = function(req,res){
  res.render('index', { title: 'Express', user:req.user ,msg :req.msg });
};