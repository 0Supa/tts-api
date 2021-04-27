const { send } = require('../util/utils.js')
const { auth } = require('../config/cfg.json')
const logger = require('../util/winston.js');
const got = require('got')

const express = require("express");
const router = express.Router();

router.get('/polly', async function (req, res) {
    const retryCount = 3
    const phrase = req.query.text
    const voice = req.query.voice

    if (!req.headers.authorization || req.headers.authorization !== auth) return res.status(401).redirect(`https://youtu.be/d1zzvW2oYjs`)
    if (!voice) return res.status(400).send({ error: { message: "You need to specify a voice" } })
    if (!phrase) return res.status(400).send({ error: { message: "You need to specify a phrase" } })
    if (phrase.length > 1500) return res.status(414).send({ error: { message: "Text should be shorter than 1500 characters" } })

    try {
        const { body } = await got.post('https://streamlabs.com/polly/speak', {
            retryCount,
            json: {
                voice,
                text: phrase
            }
        })

        const data = await got(JSON.parse(body).speak_url, { retryCount }).buffer()

        send(data, res, req, Boolean(req.query.direct))
        logger.info(`Received Polly for ${phrase}`);
    } catch (err) {
        res.status(500).send({ error: { message: `Couldn't get TTS within ${retryCount} retries` } })
        console.error(err)
    }
});

module.exports = router;