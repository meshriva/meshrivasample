/**
 * Created by meshriva on 11/21/2014.
 */
var express = require('express');

exports.createTripPage = function(req,res){

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
                res.render('createTrip', { title: 'View Planned Trips',user:req.user,status:{value:'success',msg:'Successfully update the user',obj:data.reason} });
            }else{
                res.render('createTrip', { title: 'View Planned Trips',user:req.user,status:{value:'failed',msg:'Failed to get details'} });
            }
        },function(err){
            console.log(err);
            res.render('createTrip', { title: 'View Planned Trips',user:req.user,status:{value:'failed',msg:'Failed to get details'} });

        });

    }
}

exports.createTrip = function(req,res){

    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        var open ="false";
        if(req.body.circle_options==0){
            open = true;
        }

        // create the request payload
        var payload = {
            creator:req.user.email,
            vechileRegisterationNumber:req.body.vechileRegisterationNumber,
            vechileName:req.body.vechileType,
            openSeats:req.body.open_seats,
            startLocationCity:req.body.startLocation,
            startLocationPlace:req.body.startLocationPlace,
            // yet to integerate maps on the web view
            startLocationLat:"0.00",
            startLocationLang:"0.00",
            startLocationDate:req.body.startLocationDate,
            startLocationTime:req.body.startLocationTime,
            endLocationCity:req.body.endLocation,
            endLocationPlace:req.body.endLocationPlace,
            // yet to integerate maps on the web view
            startLocationLat:"0.00",
            startLocationLang:"0.00",
            endLocationDate:req.body.endLocationDate,
            endLocationTime:req.body.endLocationTime,
            open:open,
            // as this is a creation of a new trip
            active:"true",
            trustId:req.body.circle_options,
            status:"active"
        };

        // Invoke the Post Operation
        cloudcode.post("trips",payload).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('createTrip', { title: 'New Trip',user:req.user,status:{value:'success',msg:'Successfully found the trips',obj:data.reason} });
            }else{
                res.render('createTrip', { title: 'New Trip',user:req.user,status:{value:'failed',msg:'Failed to find the trips'} });
            }
        },function(err){
            console.log(err);
            res.render('createTrip', { title: 'New Trip',user:req.user,status:{value:'failed',msg:'Failed to find the trips'} });

        });
    }

}