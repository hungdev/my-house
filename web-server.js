// librarys
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ip = require('ip');
const mqtt = require('mqtt');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('index.html');
});

// restful api for google assistant
app.get('/device/:device/state/:state', (req, res) => {
    client.publish('control', JSON.stringify({ device: req.params.device, state: req.params.state }));
    res.send('OK');
});

// socket api for webapp
io.on('connection', (socket) => {
    const client = mqtt.connect('mqtt://' + ip.address() + ':1883');

    client.on('connect', () => {
        client.subscribe('server');
    });

    client.on('message', (topic, message) => {
        try {
            const context = JSON.parse(message.toString());
            if (topic == 'server') io.emit('devices', context);
        }
        catch (error) {

        }
    });

    socket.on('control', (message) => {
        client.publish('control', JSON.stringify(message));
    });
});

server.listen(port, () => {
    console.log('Web server run on', ip.address() + ':' + port);
});