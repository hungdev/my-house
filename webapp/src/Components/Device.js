import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { yellow, blue } from '@material-ui/core/colors';
import Title from './Title';

const useStyles = makeStyles(theme => ({
    card: {
        textAlign: 'center',
        background: blue[50]
    },
    avatarOn: {
        width: 80,
        height: 80,
        color: '#000000',
        background: yellow[500]
    },
    avatarOff: {
        width: 80,
        height: 80,
        color: '#000000',
        background: yellow[50]
    },
    fab: {
        fontWeight: 'bold',
        margin: theme.spacing(1),
        width: '100%'
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
}));

export default function Device(device) {
    const classes = useStyles();

    function control(e) {
        e.preventDefault();
        device.control(device);
    }

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar
                        className={device.device.state !== 'off' ? classes.avatarOn : classes.avatarOff}
                    >
                        <h2 style={device.device.state !== 'off' ? { color: blue[900] } : { color: blue[100] }}>{device.device.name.slice(0, 1)}</h2>
                    </Avatar>
                }
                title={<Title title={device.device.name} />}
            />

            <CardActions>
                <Fab
                    variant='extended'
                    color={device.device.state === 'off' ? 'primary' : 'secondary'}
                    className={classes.fab}
                    onClick={control}
                >
                    <PowerSettingsNewIcon className={classes.extendedIcon} />
                    {device.device.state === 'off' ? 'ON' : 'OFF'}
                </Fab>
            </CardActions>
        </Card>
    );
}
