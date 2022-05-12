const mongoose = require('mongoose');
const currentAd = require('./currentAd');
const { Schema } = mongoose;

const adSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: Date.now() },
    dayCount: { type: Number, default: 1 },
    priceForPerView: {
        type: Number,
        get: v => (v / 100).toFixed(2),
        set: v => v * 100,
        required: true
    },
    price: {
        type: Number,
        get: v => (v / 100).toFixed(2),
        set: v => v * 100,
        required: true
    },
    countDailyView: { type: Number, default: 1 },
    currentAd: [{ type: Schema.Types.ObjectId, ref: 'current_ad' }]
},
    {
        toJSON: { getters: true }
    });

module.exports = mongoose.model('ad', adSchema);