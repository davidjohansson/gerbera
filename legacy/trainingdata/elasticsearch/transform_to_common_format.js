const rawData = require("./raw_from_elastic.json");

const util = require('util')

const querystring = require('querystring');


const all = rawData.map(m => {
   const parsed = querystring.parse(m.text, "+");

    return Object.entries(parsed)
    
    .filter(([key, value]) => value != '0.0')
    .filter(([key, value]) => value != 'b')
    .map(([key, value]) => {

        return {
            time: m.time,
            [key]: value
        }
    })
})
.flatMap(a => a)
.filter(a => a.time != null)
.slice()
.sort((a, b) => new Date(a.time) - new Date(b.time))


console.log(util.inspect(all, { maxArrayLength: null }))

