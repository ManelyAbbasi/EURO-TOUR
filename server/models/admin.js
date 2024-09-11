"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Admin Schema (Weak Entity)
var adminSchema = new Schema({
  adminId: {
    type: Schema.Types.ObjectId,  // Reference the ObjectId of the User
    ref: 'user',  // This links to the User model
    required: true,
  },
});

// Export the Admin model
module.exports = mongoose.model('admin', adminSchema);