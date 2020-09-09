const authModel = require("../models/authmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req,res,next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    const emailExists = await authModel.findOne({email:email});

    try {
        if (emailExists) {
            console.log("email already exists!");
            res.status(400).json({
                success: false,
                message: "email already exists!",
                userdata: emailExists
            })
        } else {
            const hashpass = await bcrypt.hash(password, 10);
            console.log(hashpass);
            try {
                const userDetails = new authModel({firstname:firstname, lastname:lastname, email:email, password:hashpass});
                const saveResult = await userDetails.save();
                console.log(saveResult);
                res.status(200).json({
                    success: true,
                    message: "new user created!",
                    userdata: saveResult
                })
            } catch (err) {
                res.status(400).json({
                    success: false,
                    message: "Oops something went wrong!",
                    error: err
                })
            }
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Signup denied!",
            error: err
        })    
    }
}

exports.login = async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const loginResult = await authModel.findOne({email: email});

    try {
        if (!loginResult) {
            console.log("loginresult: ",loginResult);
            res.status(400).json({
                success:false,
                message: "invalid credential!",
                data: loginResult
            });
        } else {
            const checkpass = await bcrypt.compare(password,loginResult.password);
            try {
                if (checkpass) {
                    console.log("checkpass result: ", checkpass);
                    const token = jwt.sign({email: loginResult.email}, "secretpass", {expiresIn: "1h"});
                    console.log("logged in successfully!", token);
                    res.status(200).json({
                        success: true,
                        message: "logged in successfully!",
                        email: loginResult.email,
                        token: token
                    })
                }
                 else{
                     console.log("wrong password!");
                        res.status(400).json({
                            success: false,
                            message: "wrong password!",
                        });
                 }
            } catch (err) {
                res.status(400).json({
                    success: false,
                    message: "Oops!Something went wrong!",
                    error: err
                });
                
            }
        }
    } 
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong!",
            error: err
        });
    }
}

exports.userDetails = (req, res, next) => {
    const _id = req.params._id;

    authModel.findById(_id)
        .then(detailsResult => {
            console.log(detailsResult);
            res.status(200).json({
                success: true,
                message: "user details",
                email: detailsResult
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                message: "search unsuccessfull!"
            })
        })

}