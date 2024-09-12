// imports the mongoose library
var mongoose = require('mongoose');
// extracts the Schema constructor from Mongoose
var Schema = mongoose.Schema;

// new schema is being defined 
var reviewSchema = new Schema({
   id: { type: String, required: true, unique: true },
   rating: { type: Number, required: true, min: 0.0, max: 5.0},
   content: { type: String, required: true },   
});

module.exports = mongoose.model('review', reviewSchema);