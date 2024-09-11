// imports the mongoose library
var mongoose = require('mongoose');
// extracts the Schema constructor from Mongoose
var Schema = mongoose.Schema;


// new schema is being defined 
var userSchema = new Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sexuality: { type: String },
    gender:{ type: String },
    isAdmin:{ type: Boolean, default: false }
});

module.exports = mongoose.model('user', userSchema);



