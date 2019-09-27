const mongoose = require('mongoose');

const Devices = mongoose.model('Devices', {
    device: String,
    name: String,
    state: String
});

module.exports = Devices;