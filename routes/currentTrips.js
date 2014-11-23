/**
 * Created by meshriva on 11/21/2014.
 */
var express = require('express');

/** Get current trips **/
exports.getCurrentTrips = function(req,res){
    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        // get the user email id from request
        var email = req.user.email;

        // log the email address
        console.log("getCurrentTrips:"+email);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        // call the cloudservice to update details
        var uri = "trips/find/activeTrips/"+email;

        // Invoke the Get Operation
        cloudcode.get(uri).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('currentTrips', { title: 'View Planned Trips',user:req.user,status:{value:'success',msg:'Successfully update the user',obj:data.reason} });
            }else{
                res.render('currentTrips', { title: 'View Planned Trips',user:req.user,status:{value:'failed',msg:'Failed to get details'} });
            }
        },function(err){
            console.log(err);
            res.render('currentTrips', { title: 'View Planned Trips',user:req.user,status:{value:'failed',msg:'Failed to get details'} });

        });
    }

}