const { send } = require('../util/utils.js')
const { auth } = require('../config/cfg.json')
const logger = require('../util/winston.js');
const got = require('got')

const express = require("express");
const router = express.Router();

router.get('/google', async function (req, res) {
    const retryCount = 3
    const phrase = req.query.text
    const lang = req.query.lang
    const speed = req.query.speed || "1"

    if (!req.headers.authorization || req.headers.authorization !== auth) return res.status(401).redirect(`https://youtu.be/d1zzvW2oYjs`)
    if (!lang) return res.status(400).send({ error: { message: "You need to specify a language" } })
    if (!phrase) return res.status(400).send({ error: { message: "You need to specify a phrase" } })
    if (phrase.length > 200) return res.status(414).send({ error: { message: "Text should be shorter than 200 characters" } })

    try {
        const data = await got(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(phrase)}&tl=${encodeURIComponent(lang)}&total=1&idx=0&textlen=${phrase.length}&client=tw-ob&prev=input&ttsspeed=${encodeURIComponent(speed)}`, { retryCount }).buffer()

        send(data, res, req, req.query.direct)
    } catch (err) {
        res.status(500).send({ error: { message: `Couldn't get TTS within ${retryCount} retries` } })
        console.error(err)
    }
    logger.info(`Received Google for ${phrase}`);
});

module.exports = router;