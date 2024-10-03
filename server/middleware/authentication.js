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
        const user = await User.findOne({"session.key": req.headers['x-auth-token']});
        if(!user){
            return res.status(404).json({"message": "User not found"})
        }
        if(Date.now() > user.session.expiry){
            return res.status(401).json({"message": "Session expired"});
        }
        req.body.isAdmin = user.isAdmin;
        next();
    }
}