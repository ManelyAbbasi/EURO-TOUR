var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PlacesToVisitModel = require('./placesToVisitModel');

var citiesSchema = new Schema({
    cityName: { type: String, required: true },
    country: { type: String, required: true },
    goodToKnow: { type: String, required: true },
    statistics: { type: String, required: true },
    facts: { type: String, required: true },
    rating: { type: Number, required: true, min: 0.0, max: 5.0 },
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
                    'affordable', 
                    'high-end',
                    'lgbtq+ friendly',
                    'walkable',
                    'small city',
                    'big city' 
                ];
                return tags.every(tag => allowedTags.includes(tag));
            },
            message: 'Invalid tag/tags provided.'
        }
    },
    placesToVisit: { 
        type: [{ type: Schema.Types.ObjectId, ref: 'placesToVisit' }],
    },
    alerts: {
        type: [String],
    }
});

module.exports = mongoose.model('cities', citiesSchema);