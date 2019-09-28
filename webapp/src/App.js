import React, { useState } from 'react';
import Top from './Components/Top';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import io from 'socket.io-client';
import Device from './Components/Device';
import ip from 'ip';

const socket = io('http://' + ip.address() + ':8080');

function App() {
    const [devices, setDevices] = useState([]);

    socket.on('devices', (message) => {
        setDevices(message);
    });

    function control(device) {
        socket.emit('control', {
            device: device.device.device,
            state: device.device.state === 'off' ? 'on' : 'off'
        });
    }

    return (
        <React.Fragment>
            <CssBaseline />

            <Top />

            <Grid container justify="center">
                {devices.map((device, index) => (
                    <Grid xs={12} md={4} key={index} item style={{ padding: 16 }}>
                        <Device
                            device={device}
                            control={control}
                        />
                    </Grid>
                ))}
            </Grid>

        </React.Fragment>
    );
}

export default App;
