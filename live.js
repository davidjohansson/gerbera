

const { LiveApi } = require('telldus-api');


const api = new LiveApi({
    key: process.env.key,
    secret: process.env.secret,
    tokenKey: process.env.tokenKey,
    tokenSecret: process.env.tokenSecret
});

async function listDevices() {
    const devices = await api.listSensors();
    console.log(devices)
}

async function showValue() {
    const devices = await api.getSensorInfo('1547407706');
    console.log(JSON.stringify(devices))
}

showValue();
