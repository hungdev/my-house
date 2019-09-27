const mosca = require('mosca');
const ip = require('ip');
const mongoose = require('mongoose');
const config = require('./config');
const Devices = require('./models/devices');

mongoose.connect(config.uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => {
    console.log('MongoDB connected');
});

const settings = {
    port: 1883
};

const server = new mosca.Server(settings);

server.on('clientConnected', (client) => {
    setTimeout(() => {
        Devices.find().exec((error, response) => {
            response.map(res => {
                server.publish({
                    topic: 'devices',
                    payload: JSON.stringify({ device: res.device, name: res.name, state: res.state })
                });
            });
        });
    }, 1e3);
});

server.on('published', (packet, client) => {
    if (packet.topic == 'devices') console.log(packet.topic, JSON.parse(packet.payload.toString()));
    if (packet.topic == 'control') {
        console.log(packet.topic, JSON.parse(packet.payload.toString()));
        let device = JSON.parse(packet.payload.toString());
        Devices.findOneAndUpdate({ device: device.device }, {
            state: device.state
        }, () => {
            Devices.find().exec((error, response) => {
                response.map(res => {
                    server.publish({
                        topic: 'devices',
                        payload: JSON.stringify({ device: res.device, name: res.name, state: res.state })
                    });
                });
            });
        });
    }
});

server.on('ready', () => {
    console.log('MQTT server run on', ip.address() + ':' + settings.port);
});