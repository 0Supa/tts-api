const { send } = require('../util/utils.js')
const { auth } = require('../config/cfg.json')
const logger = require('../util/winston.js');
const uberduck = require('../util/uberduck.js')

const express = require("express");
const router = express.Router();

router.get('/uberduck', async function (req, res) {
    const phrase = req.query.text
    const voice = req.query.lang || req.query.voice

    if (!req.headers.authorization || req.headers.authorization !== auth) return res.status(401).redirect(`https://youtu.be/d1zzvW2oYjs`)
    if (!voice) return res.status(400).send({ error: { message: "You need to specify a voice" } })
    if (!phrase) return res.status(400).send({ error: { message: "You need to specify a phrase" } })
    if (phrase.length > 600) return res.status(414).send({ error: { message: "Text should be shorter than 600 characters" } })

    try {
        const uuid = await uberduck.queue(voice, phrase)
        const res = await uberduck.getResult(uuid)
        send(data, res, req, req.query.direct)
    } catch (err) {
        res.status(500).send({ error: { message: err } })
    }

    logger.info(`Received Uberduck for ${phrase}`);
});

module.exports = router;