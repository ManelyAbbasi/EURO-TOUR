"use strict";

// imports the mongoose library
var mongoose = require('mongoose');
// extracts the Schema constructor from Mongoose
var Schema = mongoose.Schema;


// new schema named is being defined 
var userSchema = new Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    sexuality: { type: String, required: false },
    gender:{ type: String, required: false },
});

module.exports = mongoose.model('user', userSchema);



