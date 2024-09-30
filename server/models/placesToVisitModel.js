var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ReviewsModel = require('./reviewsModel'); // Assuming you're importing the model, not just the schema

var placesToVisitSchema = new Schema({
    placeName: { type: String, required: true },
    address: { type: String, required: true, unique: true, sparse: true },
    rating: { type: Number, min: 0.0, max: 5.0 },
    content: { type: String, required: true },
    tags: {
        type: [String], 
        required: true,
        validate: {
            validator: function(tags) {
                const allowedTags = [
                    'historical', 
                    'adventurous', 
                    'quiet', 
                    'party', 
                    'architecture', 
                    'sight-seeing', 
                    'museum', 
                    'new', 
                    'foodie', 
                    'nature', 
                    'foresty', 
                    'beachy', 
                    'hot weather', 
                    'cold weather', 
                    'varied weather', 
                    'popular', 
                    'cheap', 
                    'pricey', 
                    'unique'
                ];
                return tags.every(tag => allowedTags.includes(tag));
            },
            message: 'Invalid tag/tags provided.'
        }
    },
    city: { type: Schema.Types.ObjectId, ref: 'cities', required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'reviews' }]
});

// Export the model based on the schema
module.exports = mongoose.model('placesToVisit', placesToVisitSchema);