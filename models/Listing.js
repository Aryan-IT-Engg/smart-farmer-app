const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
