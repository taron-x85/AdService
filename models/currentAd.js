const mongoose = require('mongoose');
const { Schema } = mongoose;

const currentAd = new Schema({
    viewed: { type: Number, default: 0 },
    day: { type: Date },
    adId: {}
});

module.exports = mongoose.model('current_ad', currentAd);