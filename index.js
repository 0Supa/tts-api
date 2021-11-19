const { port } = require('./config/cfg.json')
const express = require('express')
const app = express()
const google = require("./routes/google.js");
const polly = require("./routes/polly.js");
const uberduck = require("./routes/uberduck.js");

app.use('/tts', [google, polly, uberduck, express.static('./static', { extensions: ['mp3'] })])

app.listen(port, () => {
    console.log(`listening on ${port}`)
})