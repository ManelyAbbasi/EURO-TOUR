var mongoose = require('mongoose');
const reviewsSchema = require('./reviewsModel');
var Schema = mongoose.Schema;

var placesToVisitSchema = new Schema({
    address: { type: String, required: true, unique: true },
    rating: { type: Number, min: 0.0, max: 5.0},
    content: { type: String, required: true },
    tags: { type: Array, required: true },
    reviews: [reviewsSchema]
  });
  
  // Export the placesToVisit model
  module.exports =  placesToVisitSchema;

  