/**
 * Created by meshriva on 11/21/2014.
 */
var express = require('express');

exports.signin = function(req,res){
    res.render('signin', { title: 'Express',user:{},msg : {} });
};

exports.signup = function(req,res){
    res.render('signup', { title: 'Express',user:{},msg : {} });
};
