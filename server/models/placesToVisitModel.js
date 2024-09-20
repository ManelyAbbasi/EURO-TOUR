var mongoose = require('mongoose');
const reviewsSchema = require('./reviewsModel');
var Schema = mongoose.Schema;

var placesToVisitSchema = new Schema({
    placeName: { type: String, required: true },
    address: { type: String, required: true, unique: true, sparse:true },
    rating: { type: Number, min: 0.0, max: 5.0},
    content: { type: String, required: true },
    tags: { type: Array, required: true },
    reviews: [reviewsSchema]
  });
  
  // Export the placesToVisit model
  module.exports =  placesToVisitSchema;

  