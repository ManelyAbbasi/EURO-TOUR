// imports the mongoose library
var mongoose = require('mongoose');
// extracts the Schema constructor from Mongoose
var Schema = mongoose.Schema;


// new schema is being defined 
var usersSchema = new Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    birthDate: { type: Date, required: true, min: new Date(1920, 1, 1), max: new Date(2012, 1, 1) },
    isLGBTQIA: { type: Boolean, default: false },  
    
    gender: { 
        type: String, 
        enum: ['male', 'female', 'non-binary', 'other'], 
        default: 'other'  
    },
    
    isAdmin:{ type: Boolean, default: false }
});

module.exports = mongoose.model('users', usersSchema);



