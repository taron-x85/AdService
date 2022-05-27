const mongoose = require('mongoose');
const { Schema } = mongoose;

const currentAd = new Schema({
    viewed: { type: Number, default: 0 },
    day: { type: Date },
    adId: { type: Schema.Types.ObjectId, ref: 'ad' }
});

module.exports = mongoose.model('current_ad', currentAd);