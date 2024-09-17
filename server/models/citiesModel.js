var mongoose = require('mongoose');
const placesToVisitSchema = require('./placesToVisitModel');
const reviewsSchema = require('./reviewsModel');
var Schema = mongoose.Schema;

var citiesSchema = new Schema({ 
    postcode: { type: String, required: true, unique: true },
    cityName: { type: String, required: true },
    country: { type: String, required: true },
    statistics: { type: String, required: true },
    facts: { type: String, required: true },
    tags: { type: Array, required: true },
    placesToVisit: [placesToVisitSchema],
    reviews: [reviewsSchema]
  });
  
  // Export the city model
  module.exports = mongoose.model('cities', citiesSchema);