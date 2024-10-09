// imports the mongoose library
var mongoose = require('mongoose');
// extracts the Schema constructor from Mongoose
var Schema = mongoose.Schema;


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
    isAdmin: { type: Boolean, default: false },
    session: {
        key: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true, 
            unique: true,
            sparse: true
        }, 
        expiry: {type: Date,
            required: true}
    },
    cityFavs: [{ type: Schema.Types.ObjectId, ref: 'cities' }],  // Separate array for favorite cities
    placeFavs: [{ type: Schema.Types.ObjectId, ref: 'placesToVisit' }] // Separate array for favorite places
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

module.exports = mongoose.model('users', usersSchema);



