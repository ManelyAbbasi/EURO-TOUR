"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
    cityName: { type: String, required: true, unique: true },
    country: { type: String, required: true, unique: true },
    statistics: { type: String, required: true },
    facts: { type: String, required: true },
    tags: { type: Array, required: true },
  });
  
  // Export the city model
  module.exports = mongoose.model('city', citySchema);

  