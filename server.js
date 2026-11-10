const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Listing = require('./models/Listing');
const Expense = require('./models/Expense');
const Advisory = require('./models/Advisory');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmerDB')
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log("DB Connection Error: ", err));

// --- FEATURE 1: APMC Market Prices ---
app.get('/api/market-prices', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY || 'YOUR_DATA_GOV_API_KEY';
        const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=10`;
        
        const response = await axios.get(apiUrl);
        res.json({ success: true, data: response.data.records });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching market prices", error: error.message });
    }
});

// --- FEATURE 2: Weather Forecast ---
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const latitude = lat || 18.5204;
        const longitude = lon || 73.8567;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_temperature_0cm,soil_moisture_0_to_1cm&timezone=auto`;
        const response = await axios.get(weatherUrl);
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching weather data", error: error.message });
    }
});

// --- FEATURE 3: Direct Farmer-to-Buyer Listings ---
app.post('/api/listings', async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res.status(201).json({ success: true, message: "Crop listed successfully", data: newListing });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/listings', async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        res.json({ success: true, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- FEATURE 4: Expense & Profit Tracker ---
app.post('/api/expenses', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json({ success: true, message: "Expense recorded successfully", data: expense });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json({ success: true, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- FEATURE 5: Expert Advisory ---
app.post('/api/advisory', async (req, res) => {
    try {
        const advisory = new Advisory(req.body);
        await advisory.save();
        res.status(201).json({ success: true, message: "Question submitted to expert successfully", data: advisory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/advisory', async (req, res) => {
    try {
        const advisories = await Advisory.find().sort({ createdAt: -1 });
        res.json({ success: true, data: advisories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Serve Frontend ---
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));