/**
 * Created by meshriva on 11/22/2014.
 */
var express = require('express');

exports.showServicePage = function(req,res){
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        console.log('The user info in getServiceInfo method is '+req.user.email);
        res.render('circleServices', { title: 'Services',user:req.user,msg : {},status:{} });
    }
}

exports.showSearchOptions = function(req,res){
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        res.render('searchCircles', { title: 'Search Circle',user:req.user,msg : {},status:{} });
    }
}

exports.searchCircles = function(req,res){

    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        // get data from request
        var admin = req.body.admin;
        var location = req.body.location;

        var circleQuery = {};

        if(admin!=undefined && admin!=""){
            circleQuery.admin = admin;
        }

        if(location!=undefined && location!=""){
            circleQuery.location = location;
        }

        // print the response of the request data
        console.log(circleQuery);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        // set up the URI
        var uri = "circles/find";

        // Invoke the Post Operation
        cloudcode.post(uri,circleQuery).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'success',msg:'Successfully found circles',obj:data.reason} });
            }else{
                res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });
            }
        },function(err){
            console.log(err);
            res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });

        });

        //res.render('searchCircles', { title: 'Search Circle',user:req.user,msg : {} });
    }
}


exports.subscribeCircle = function(req,res){

    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else {
        // get the request from request
        var user = req.params.user;
        var circle_name = req.params.name;
        var circle_desc = req.params.desc;
        var circle_admin = req.params.admin;
        var circle_open = req.params.open;
        var circle_active = req.params.active;
        var circle_location = req.params.location;
        var trustId = req.params.trustId;

        // print the response received
        console.log("subscribeCircle" + user + " , " + circle_name + " , " + circle_desc + " , " + circle_admin + " , "
        + circle_open + " , " + circle_active + " , " + circle_location + " , " + trustId);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        // generate the request payload
        var payload = {
            user:user,
            circle_name:circle_name,
            circle_desc:circle_desc,
            circle_admin:circle_admin,
            circle_open:circle_open,
            circle_active:circle_active,
            circle_location:circle_location,
            trustId:trustId
        };

        // set up the URI
        var uri = "circleUsers/subscribe";

        // Invoke the Post Operation
        cloudcode.post(uri,payload).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'success',msg:'Successfully found circles',obj:data.reason} });
            }else{
                res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });
            }
        },function(err){
            console.log(err);
            res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });

        });

    }

}

exports.postSubscribeCircle = function (req,res) {
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else {
        // get the request from request
        var user = req.body.user;
        var circle_name = req.body.name;
        var circle_desc = req.body.desc;
        var circle_admin = req.body.admin;
        var circle_open = req.body.open;
        var circle_active = req.body.active;
        var circle_location = req.body.location;
        var trustId = req.body.trustId;

        // print the response received
        console.log("subscribeCircle" + user + " , " + circle_name + " , " + circle_desc + " , " + circle_admin + " , "
        + circle_open + " , " + circle_active + " , " + circle_location + " , " + trustId);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        // generate the request payload
        var payload = {
            user:user,
            circle_name:circle_name,
            circle_desc:circle_desc,
            circle_admin:circle_admin,
            circle_open:circle_open,
            circle_active:circle_active,
            circle_location:circle_location,
            trustId:trustId
        };

        // set up the URI
        var uri = "circleUsers/subscribe";

        // Invoke the Post Operation
        cloudcode.post(uri,payload).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status+":");
            if (data != undefined && data.status=="success" ) {
                res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'success',msg:'Successfully found circles',obj:data.reason} });
            }

            if (data != undefined && data.status=="duplicate" ) {
                res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'duplicate',msg:'Failed to get information on circles'} });
            }

            else{
                res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });
            }
        },function(err){
            console.log(err);
            res.render('searchCircles', { title: 'Search Circles',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });

        });
    }
}

exports.showCirclePendingRequest = function(req,res){
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        // get the user name from request parameter
        var admin = req.user.email;

        // print the user name
        console.log("showCirclePendingRequest:"+admin);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        // set up the URI
        var uri = 'circleUsersPending/'+admin;

        // Invoke the GET Operation
        cloudcode.get(uri).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('pendingCircleRequest', { title: 'Pending Circle Request',user:req.user,status:{value:'success',msg:'Successfully found pending circle request',obj:data.reason} });
            }else{
                res.render('pendingCircleRequest', { title: 'Pending Circle Request',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });
            }
        },function(err){
            console.log(err);
            res.render('pendingCircleRequest', { title: 'Pending Circle Request',user:req.user,status:{value:'failed',msg:'Failed to get information on circles'} });

        });



    }

}


exports.submitPermissionUpdate = function (req,res) {
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{

        // get the request from data
        var action = req.body.decision_options;
        var user = req.body.user;
        var circle_name =req.body.circle_name;
        var circle_desc =req.body.circle_desc;
        var circle_admin =req.body.circle_admin;
        var circle_open =req.body.circle_open;
        var circle_active =req.body.circle_active;
        var circle_location=req.body.circle_location;
        var trustId = req.body.trustId;

        // print the data received
        console.log(action+" , "+user+" , "+circle_name+" , "+circle_desc+" , "+circle_admin+" , "+circle_open+" , "+circle_active+" , "+circle_location+" , "+trustId);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        // create the payload
        var payload = {
            action:action,
            user:user,
            circle_name:circle_name,
            circle_desc:circle_desc,
            circle_admin:circle_admin,
            circle_open:circle_open,
            circle_active:circle_active,
            circle_location:circle_location,
            trustId:trustId
        };

        // set up the URI
        var uri = "circleUsersPending/updateStatus";

        // Invoke the GET Operation
        cloudcode.post(uri,payload).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('pendingCircleRequest', { title: 'Pending Circle Request',user:req.user,status:{value:'successResponse',msg:'Successfully found pending circle request',obj:data.reason} });
            }else{
                res.render('pendingCircleRequest', { title: 'Pending Circle Request',user:req.user,status:{value:'failedResponse',msg:'Failed to get information on circles'} });
            }
        },function(err){
            console.log(err);
            res.render('pendingCircleRequest', { title: 'Pending Circle Request',user:req.user,status:{value:'failedResponse',msg:'Failed to get information on circles'} });

        });

    }
}