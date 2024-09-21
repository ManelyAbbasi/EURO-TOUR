// imports the mongoose library
var mongoose = require('mongoose');
const placesToVisit = require('./placesToVisitModel');
// extracts the Schema constructor from Mongoose
var Schema = mongoose.Schema;


// new schema is being defined 
var reviewsSchema = new Schema({
   rating: { type: Number, required: true, min: 0.0, max: 5.0},
   content: { type: String, required: true, maxLength: [200, 'Max character length exceeded'] },  
   date: { type: Date, default: Date.now },
   user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

module.exports = reviewsSchema;