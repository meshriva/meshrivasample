/**
 * Created by meshriva on 11/22/2014.
 */
var express = require('express');

/** to get the updateUser page **/
exports.getUpdateUserPage = function(req,res){

    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        console.log('getUpdateUserPage method for '+req.user.email);
        res.render('updateUser', { title: 'Update User Details',user:req.user,status:{} });
    }
}

/** update user details
 * uses IBM cloud service to get the data updated **/
exports.updateDetails = function(req,res){

    if (!req.isAuthenticated()){
        console.log('login first');
        res.redirect('/signin');
    }else{
        // get the data from request
        var email = req.body.email;
        var name = req.body.name;
        var password = req.body.password;
        var phoneNumber = req.body.phoneNumber;
        var currentLocation = req.body.currentLocation;
        var vechileRegisterationNumber = req.body.vechileRegisterationNumber;

        // print the data received
        console.log("updateDetails method:"+email+" ,"+name+" , "+password+" , "+phoneNumber+" , "+currentLocation+" , "+vechileRegisterationNumber);

        // get cloudcode from req attribute
        var cloudcode = req.cloudcode;

        var payload = {
            email:email,
            name : name,
            password:password,
            phoneNumber:phoneNumber,
            currentLocation:currentLocation,
            vechileRegisterationNumber:vechileRegisterationNumber
        };

        // call the cloudservice to update details
        // Invoke the Put Operation
        var uri = "users/"+email;
        cloudcode.put(uri,payload).then(function(response) {
            console.log(response);
            var data = JSON.parse(response);
            console.log("here"+data.status);
            if (data != undefined && data.status=="success" ) {
                res.render('updateUser', { title: 'Update User Details',user:data.response.attributes,status:{value:'success',msg:'Successfully update the user'} });
            }else{
                res.render('updateUser', { title: 'Update User Details',user:req.user,status:{value:'failed',msg:'Failed to update the user'} });
            }
        },function(err){
            console.log(err);
            res.render('updateUser', { title: 'Update User Details',user:req.user,status:{value:'failed',msg:'Failed to update the user'} });

        });
    }
}
