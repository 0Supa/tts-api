const { send } = require('../util/utils.js')
const { auth } = require('../config/cfg.json')
const logger = require('../util/winston.js')
const uberduck = require('../util/uberduck.js')
const got = require('got')

const express = require("express");
const router = express.Router();

app.use(express.json());

async function handle(req, res, phrase, voice) {
    if (!req.headers.authorization || req.headers.authorization !== auth) return res.status(401).redirect(`https://youtu.be/d1zzvW2oYjs`)
    if (!voice) return res.status(400).send({ error: { message: "You need to specify a voice" } })
    if (!phrase) return res.status(400).send({ error: { message: "You need to specify a phrase" } })
    if (phrase.length > 600) return res.status(414).send({ error: { message: "Text should be shorter than 600 characters" } })

    try {
        const uuid = await uberduck.queue(voice, phrase)
        const tts = await uberduck.getResult(uuid)
        if (req.query.direct) return res.send({ url: tts.path })

        const data = await got(tts.path).buffer()

        send(data, res, req, false)
    } catch (err) {
        res.status(500).send({ error: { message: err } })
    }
}

router.get('/uberduck', async function (req, res) {
    const phrase = req.query.text
    const voice = req.query.lang || req.query.voice

    await handle(res, req, phrase, voice)

    logger.info(`Received Uberduck for ${phrase}`);
});

router.post('/uberduck', async function (req, res) {
    const phrase = req.body.text
    const voice = req.body.lang || req.body.voice

    await handle(res, req, phrase, voice)

    logger.info(`Received Uberduck for ${phrase}`);
});

module.exports = router;