const mongoose = require('mongoose');
const { Schema } = mongoose;

const adSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: Date.now() },
    dayCount: { type: Number, default: 1 },
    price: {
        type: Number,
        get: v => (v / 100).toFixed(2),
        set: v => v * 100,
        required: true
    },
    countDailyView: { type: number, default: 1 }
},
    {
        toJSON: { getters: true }
    });

module.exports = mongoose.model('Ad', adSchema);