const { send } = require('../util/utils.js')
const { auth } = require('../config.json')
const logger = require('../util/winston.js');
const got = require('got')

const express = require("express");
const router = express.Router();

router.get('/polly', async function (req, res) {
    const retryCount = 3
    const phrase = req.query.text
    const voice = req.query.lang || req.query.voice

    if (!req.headers.authorization || req.headers.authorization !== auth) return res.status(401).redirect(`https://youtu.be/d1zzvW2oYjs`)
    if (!voice) return res.status(400).send({ error: { message: "You need to specify a voice" } })
    if (!phrase) return res.status(400).send({ error: { message: "You need to specify a phrase" } })
    if (phrase.length > 600) return res.status(414).send({ error: { message: "Text should be shorter than 600 characters" } })

    try {
        const data = await got(`https://api.streamelements.com/kappa/v2/speech?voice=${encodeURIComponent(voice)}&text=${encodeURIComponent(phrase)}`, { retryCount }).buffer()

        send(data, res, req, req.query.direct)
    } catch (err) {
        res.status(500).send({ error: { message: `Couldn't get TTS within ${retryCount} retries` } })
        console.error(err)
    }
    logger.info(`Received Polly for ${phrase}`);
});

module.exports = router;