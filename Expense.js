const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Seeds, Fertilizers, Labor
    amount: { type: Number, required: true },
    income: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);