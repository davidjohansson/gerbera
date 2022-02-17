const {InfluxDB, Point, HttpError} = require('@influxdata/influxdb-client')
const {url, token, org, bucket} = require('./env')
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

async function energyMeter(){
    const reading = await api.getSensorInfo("1550049126");
    console.log(JSON.stringify(reading))

}
async function readValue() {
    const devices = await api.listSensors();
    return Promise.all( devices.map(async device => {
        
        const reading = await api.getSensorInfo(device.id);
        console.log(JSON.stringify(reading))

        const tempValues = reading.data?.filter( entry => entry.name === 'temp') || [ { value: 0.0 } ]
        const humidityValues = reading.data?.filter( entry => entry.name === 'humidity') || [ {value:  0.0 } ]
        
        const newLocal = {
            sensorId: device.id,
            time: reading.lastUpdated,
            location: reading.name,
            temperature: tempValues[0] ? tempValues[0].value : 0,
            humidity: humidityValues[0] ? humidityValues[0].value : 0


        };
        return newLocal
    }))
}

async function readValueRaw() {
    const devices = await api.listSensors();
    return Promise.all( devices.map(async device => {
        
        const reading = await api.getSensorInfo(device.id);

        console.log(JSON.stringify(reading));
    }))
}
async function storeLocally() {
    const readings = await readValue()
    console.log(JSON.stringify(readings));
}

async function storeInInfluxDB() {
    const readings = await readValue();
    console.log('*** WRITE POINTS ***')
    // create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
    const writeApi = new InfluxDB({url, token}).getWriteApi(org, bucket, 'ns')
    
    
    readings.forEach(reading => {
        // write point with the current (client-side) timestamp
        const point1 = new Point('airSensor')
        .tag('location', reading.location)
        .floatField('temperature', reading.temperature)
        // .timestamp(reading.time) // can be also a number, but in writeApi's precision units (s, ms, us, ns)!
        writeApi.writePoint(point1)
        console.log(` ${point1}`)
        
        // write point with a custom timestamp
        const point2 = new Point('airSensor')
        .tag('location', reading.location)
        .floatField('humidity', reading.humidity)
        // .timestamp(reading.time) // can be also a number, but in writeApi's precision units (s, ms, us, ns)!
        writeApi.writePoint(point2)
        console.log(` ${point2.toLineProtocol(writeApi)}`)
        
    })
    
    
    // WriteApi always buffer data into batches to optimize data transfer to InfluxDB server and retries
    // writing upon server/network failure. writeApi.flush() can be called to flush the buffered data,
    // close() also flushes the remaining buffered data and then cancels pending retries.
    writeApi
    .close()
    .then(() => {
        console.log('FINISHED ... now try ./query.ts')
    })
    .catch(e => {
        console.error(e)
        if (e instanceof HttpError && e.statusCode === 401) {
            console.log('Run ./onboarding.js to setup a new InfluxDB database.')
        }
        console.log('\nFinished ERROR')
    })
}


// energyMeter();
// listDevices();
storeInInfluxDB();
// readValueRaw();
//  storeLocally();

//listDevices();
