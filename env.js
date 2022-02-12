const url = process.env['INFLUX_URL'] || 'https://eu-central-1-1.aws.cloud2.influxdata.com'
const token = process.env['INFLUX_TOKEN'] 
const org = process.env['INFLUX_ORG'] || 'david.u.johansson@gmail.com'
const bucket = 'larlingsgatan'

module.exports = {
  url,
  token,
  org,
  bucket,
}