var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({ 
    postcode: { type: String, required: true, unique: true },
    cityName: { type: String, required: true },
    country: { type: String, required: true },
    statistics: { type: String, required: true },
    facts: { type: String, required: true },
    tags: { type: Array, required: true },
  });
  
  // Export the city model
  module.exports = mongoose.model('city', citySchema);