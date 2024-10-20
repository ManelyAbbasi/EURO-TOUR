var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminsSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    session: {
        key: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            unique: true,
            sparse: true
        },
        expiry: {
            type: Date,
            required: true
        }
    }
});

module.exports = mongoose.model('admins', adminsSchema);
