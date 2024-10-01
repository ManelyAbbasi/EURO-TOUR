const User = require('../models/usersModel');
const mongoose = require('mongoose');

module.exports = async function(req, res, next){
    if (!req.headers['x-auth-token']){
        req.body.session = {
            key: new mongoose.Types.ObjectId(),
            expiry: Date.now()+60*60*1000
        }
        res.set('x-auth-token', req.body.session.key);
        next();
    } else {
        const user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(404).json({"message": "User not found"})
        } 
        if(req.headers.x-auth-token !== user.session.key){
            return res.status(401).json({"message": "Invalid session"});
        } 
        if(Date.now() > user.session.expiry){
            return res.status(401).json({"message": "Session expired"});
        }
        next();
    }
}