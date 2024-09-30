// imports the mongoose library
var mongoose = require('mongoose');
// extracts the Schema constructor from Mongoose
var Schema = mongoose.Schema;
// Library for using passport-local with mongoose
var passportLocalMongoose = require('passport-local-mongoose');


// new schema is being defined 
var usersSchema = new Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String },
    birthDate: { type: Date, required: true, min: new Date(1920, 1, 1), max: new Date(2012, 1, 1) },
    isLGBTQIA: { type: Boolean, default: false },  
    gender: { 
        type: String, 
        enum: ['male', 'female', 'non-binary', 'other'], 
        default: 'other'  
    },
    isAdmin: { type: Boolean, default: false }
}, {
    toJSON: {
        transform: function(doc, ret) {
            if (ret.birthDate) {
                ret.birthDate = ret.birthDate.toISOString().split('T')[0];
            }
            return ret;
        }
    }
});

usersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', usersSchema);



