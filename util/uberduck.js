const config = require('../config/cfg.json')
const auth = Buffer.from(`${config.uberduck.key}:${config.uberduck.secret}`).toString('base64')
const got = require('got')

async function check(uuid) {
    const { body: res } = await got(`https://api.uberduck.ai/speak-status?uuid=${uuid}`, { responseType: 'json' })
    return res
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

exports.getResult = async (uuid) => {
    while (true) {
        await sleep(1000)
        const result = await check(uuid)
        if (result.path) return result
        if (Date.parse(result.started_at) > Date.now() - 600000) throw "Your TTS result was thrown because it didn't return in less than 10 minutes"
    }
}

exports.queue = async (voice, speech) => {
    const { body: res } = await got.post('https://api.uberduck.ai/speak', {
        throwHttpErrors: false,
        responseType: 'json',
        headers: { Authorization: `Basic ${auth}` },
        json: { voice, speech }
    })
    if (!res.uuid) throw res.detail || "Unknown error"
    return res.uuid
}
