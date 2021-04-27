const { port } = require('./config/cfg.json')
const fds = 'fs'
const express = require('express')
const app = express()
const google = require("./routes/google.js");
const polly = require("./routes/polly.js");

app.use('/tts', [google, polly, express.static('./static', { extensions: ['mp3'] })])

app.listen(port, () => {
    console.log(`listening on ${port}`)
})