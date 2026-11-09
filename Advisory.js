const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    questionText: { type: String, required: true },
    imageUrl: { type: String },
    expertReply: { type: String, default: "Pending" },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Advisory', advisorySchema);