var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Import models to use ObjectId references
const PlacesToVisitModel = require('./placesToVisitModel'); // Ensure this exports the model
const ReviewsModel = require('./reviewsModel'); // Ensure this exports the model

var citiesSchema = new Schema({
    cityName: { type: String, required: true },
    country: { type: String, required: true },
    statistics: { type: String, required: true },
    facts: { type: String, required: true },
    tags: { type: Array, required: true },
    placesToVisit: [{ type: Schema.Types.ObjectId, ref: 'placesToVisit', default: [] }], // Reference to the placesToVisit model
    reviews: [{ type: Schema.Types.ObjectId, ref: 'reviews',default: [] }] // Reference to the reviews model
});

// Export the cities model
module.exports = mongoose.model('cities', citiesSchema);