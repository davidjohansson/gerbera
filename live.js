

const { LiveApi } = require('telldus-api');


const api = new LiveApi({
    key: process.env.key,
    secret: process.env.secret,
    tokenKey: process.env.tokenKey,
    tokenSecret: process.env.tokenSecret
    // key:'FEHUVEW84RAFR5SP22RABURUPHAFRUNU',
    // secret:'ZUXEVEGA9USTAZEWRETHAQUBUR69U6EF',
    // tokenKey:'4e639229af30dc575550e701038cf1d006161a033',
    // tokenSecret:'1fb8797c9a03f47beb14b540ea9b3689'
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
