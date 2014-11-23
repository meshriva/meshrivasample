/**
 * Created by meshriva on 11/21/2014.
 */
var express = require('express');

exports.getServiceInfo = function(req,res){

    /**
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        console.log('The user info in getServiceInfo method is '+req.user.email);
        res.render('services', { title: 'Services',user:req.user,msg : {} });
    }
     **/

    // get cloudcode from req attribute
    var cloudcode = req.cloudcode;

    // set up the URI
    var uri = 'circleUsersPending/meshriva@in.ibm.com';

    // Invoke the GET Operation
    cloudcode.get(uri).then(function(response) {
        console.log(response);
        var data = JSON.parse(response);
        console.log("here"+data.status);
        if (data != undefined && data.status=="success" ) {
            res.render('services', { title: 'Services',user:req.user,msg : {} });
        }else{
            res.render('services', { title: 'Services',user:req.user,msg : {} });
        }
    },function(err){
        console.log(err);
        res.render('services', { title: 'Services',user:req.user,msg : {} });

    });

};
