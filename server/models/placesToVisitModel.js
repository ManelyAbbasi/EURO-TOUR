var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ReviewsModel = require('./reviewsModel'); // Assuming you're importing the model, not just the schema

// Define the schema for placesToVisit
var placesToVisitSchema = new Schema({
    placeName: { type: String, required: true },
    address: { type: String, required: true, unique: true, sparse: true },
    rating: { type: Number, min: 0.0, max: 5.0 },
    content: { type: String, required: true },
    tags: { type: Array, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'cities', required: true }, 
    reviews: [{ type: Schema.Types.ObjectId, ref: 'reviews' }] // Use ObjectId to reference the reviews
});

// Export the model based on the schema
module.exports = mongoose.model('placesToVisit', placesToVisitSchema);