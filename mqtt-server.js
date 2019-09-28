// librarys
const mosca = require('mosca');
const ip = require('ip');
const mongoose = require('mongoose');
const config = require('./config');
const Devices = require('./models/devices');

// connect mongodb, your mongodb uri in: config.js
mongoose.connect(config.uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => {

});

const settings = {
    port: 1883
};

const server = new mosca.Server(settings);

// handle connected
server.on('clientConnected', (client) => {
    setTimeout(() => {
        Devices.find().exec((error, response) => {
            response.map(res => {
                server.publish({
                    topic: 'devices',
                    payload: JSON.stringify({ device: res.device, name: res.name, state: res.state })
                });
            });
            let devices = response.map(res => {
                return new Object({ device: res.device, name: res.name, state: res.state });
            });
            server.publish({
                topic: 'server',
                payload: JSON.stringify(devices)
            });
        });
    }, 1e3);
});

// handle publish
server.on('published', (packet, client) => {
    if (packet.topic == 'control') {
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
                let devices = response.map(res => {
                    return new Object({ device: res.device, name: res.name, state: res.state });
                });
                server.publish({
                    topic: 'server',
                    payload: JSON.stringify(devices)
                });
            });
        });
    }
});

server.on('ready', () => {
    console.log('MQTT server run on', ip.address() + ':' + settings.port);
});