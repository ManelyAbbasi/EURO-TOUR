var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Import models to use ObjectId references
const PlacesToVisitModel = require('./placesToVisitModel'); // Ensure this exports the model

var citiesSchema = new Schema({
    cityName: { type: String, required: true },
    country: { type: String, required: true },
    statistics: { type: String, required: true },
    facts: { type: String, required: true },
    tags: {
        type: [String], 
        required: true,
        validate: {
            validator: function(tags) {
                const allowedTags = [
                    'historical',  
                    'quiet', 
                    'party', 
                    'architecture', 
                    'recently added',  
                    'nature', 
                    'beachy', 
                    'warm weather', 
                    'cold weather',  
                    'popular', 
                    'cheap', 
                    'high-end', 
                ];
                return tags.every(tag => allowedTags.includes(tag));
            },
            message: 'Invalid tag/tags provided.'
        }
    },
    placesToVisit: { 
        type: [{ type: Schema.Types.ObjectId, ref: 'placesToVisit' }], // Ensure 'PlacesToVisit' matches the model name
        default: [] 
    },
});

// Export the cities model
module.exports = mongoose.model('cities', citiesSchema);