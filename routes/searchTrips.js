/**
 * Created by meshriva on 11/21/2014.
 */
var express = require('express');

exports.getSearchTripPage = function(req,res){

    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
       // get the circles for the user and move him
        // get the user email id from request
        var email = req.user.email;

        // log the email address
        console.log("getSearchTripPage:"+email);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        // call the cloudservice to update details
        var uri = "circleUsers/"+email;

        // Invoke the Get Operation
        cloudcode.get(uri).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('searchTrips', { title: 'View Planned Trips',user:req.user,status:{value:'success',msg:'Successfully update the user',obj:data.reason} });
            }else{
                res.render('searchTrips', { title: 'View Planned Trips',user:req.user,status:{value:'failed',msg:'Failed to get details'} });
            }
        },function(err){
            console.log(err);
            res.render('searchTrips', { title: 'View Planned Trips',user:req.user,status:{value:'failed',msg:'Failed to get details'} });

        });

    }
}

exports.getAvailableTrips = function(req,res){
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        // get the data from request
        var startLocation = req.body.startLocation;
        var startLocationDate = req.body.startLocationDate;
        var endLocation = req.body.endLocation;
        var trustId = req.body.circle_options;

        // display the data received
        console.log("getAvailableTrips"+startLocation+" , "+startLocationDate+" , "+endLocation+" , "+trustId);

        var tripQuery = {trustId:trustId};

        if(startLocation!=undefined && startLocation!=""){
            tripQuery.startLocationCity = startLocation;
        }

        if(startLocationDate!=undefined && startLocationDate!="" ){
            tripQuery.startLocationDate = startLocationDate;
        }

        if(endLocation!=undefined && endLocation!=""){
            tripQuery.endLocationCity = endLocation;
        }


         // display the object created
        console.log(tripQuery);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;


        var uri = "trips/find";

        // Invoke the Post Operation
        cloudcode.post(uri,tripQuery).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('availableTrips', { title: 'Update User Details',user:req.user,status:{value:'success',msg:'Successfully found the trips',obj:data.reason} });
            }else{
                res.render('availableTrips', { title: 'Update User Details',user:req.user,status:{value:'failed',msg:'Failed to find the trips'} });
            }
        },function(err){
            console.log(err);
            res.render('updateUser', { title: 'Update User Details',user:req.user,status:{value:'failed',msg:'Failed to find the trips'} });

        });
    }

}

exports.subscribe = function(req,res){
    // get the data from request
    var tripId = req.params.tripId;
    var trustId = req.params.trustId;
    var creator = req.params.creator;
    var user = req.params.user;
    var status = req.params.status;

    //  print the response received in logger
    console.log(tripId+" , "+trustId+" , "+creator+" , "+user+" , "+status);

    // get cloudcode from req attribute
    var cloudcode = req.cloudcode;

    var uri ="tripUsers/subscribe";
    var payload = {
        trustId:trustId,
        tripId:tripId,
        creator:creator,
        user:user,
        status:status
    };

    // call POST service on cloud
    try {
        cloudcode.post(uri, payload).then(function (response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here" + data.status);
            if (data != undefined && data.status == "success") {
                res.render('subscribeTripRequestResult', {
                    title: 'Subscribe Trip',
                    user: req.user,
                    status: {value: 'success', msg: 'Successfully subscriber the user', obj: data.reason}
                });
            } else if (data != undefined && data.status == "duplicate") {
                res.render('subscribeTripRequestResult', {
                    title: 'Subscribe Trip',
                    user: req.user,
                    status: {value: 'duplicate', msg: 'Duplicate request sent'}
                });
            } else {
                res.render('subscribeTripRequestResult', {
                    title: 'Subscribe Trip',
                    user: req.user,
                    status: {value: 'duplicate', msg: 'Failed to subscribe the user'}
                });
            }
        }, function (err) {
            console.log(err);
            res.render('subscribeTripRequestResult', {
                title: 'Subscribe Trip',
                user: req.user,
                status: {value: 'failed', msg: 'Failed to subscribe the user'}
            });

        });
    }catch (err){
        res.render('subscribeTripRequestResult', {
            title: 'Subscribe Trip',
            user: req.user,
            status: {value: 'duplicate', msg: 'Failed to subscribe the user'}
        });
    }

}

exports.postSubscribeTrip = function(req,res){

    // get the data from request
    var tripId = req.body.tripId;
    var trustId = req.body.trustId;
    var creator = req.body.creator;
    var user = req.body.user;
    var status = req.body.status;

    //  print the response received in logger
    console.log(tripId+" , "+trustId+" , "+creator+" , "+user+" , "+status);

    // get cloudcode from req attribute
    var cloudcode = req.cloudcode;

    var uri ="tripUsers/subscribe";
    var payload = {
        trustId:trustId,
        tripId:tripId,
        creator:creator,
        user:user,
        status:status
    };

    // call POST service on cloud
    try {
        cloudcode.post(uri, payload).then(function (response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here" + data.status);
            if (data != undefined && data.status == "success") {
                res.render('subscribeTripRequestResult', {
                    title: 'Subscribe Trip',
                    user: req.user,
                    status: {value: 'success', msg: 'Successfully subscriber the user', obj: data.reason}
                });
            } else if (data != undefined && data.status == "duplicate") {
                res.render('subscribeTripRequestResult', {
                    title: 'Subscribe Trip',
                    user: req.user,
                    status: {value: 'duplicate', msg: 'Duplicate request sent'}
                });
            } else {
                res.render('subscribeTripRequestResult', {
                    title: 'Subscribe Trip',
                    user: req.user,
                    status: {value: 'duplicate', msg: 'Failed to subscribe the user'}
                });
            }
        }, function (err) {
            console.log(err);
            res.render('subscribeTripRequestResult', {
                title: 'Subscribe Trip',
                user: req.user,
                status: {value: 'failed', msg: 'Failed to subscribe the user'}
            });

        });
    }catch (err){
        res.render('subscribeTripRequestResult', {
            title: 'Subscribe Trip',
            user: req.user,
            status: {value: 'duplicate', msg: 'Failed to subscribe the user'}
        });
    }

}