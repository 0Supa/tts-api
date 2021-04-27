const { url } = require('../config/cfg.json')
const path = require('path')
const fs = require('fs')

module.exports = {
    send: function (data, res, req, direct) {
        const fileName = random(8)

        fs.writeFile(`./static/${fileName}.mp3`, data, { flag: "wx" }, function (err) {
            if (err) {
                if (err.code === 'EEXIST') return send(data, res, req, direct)
                console.error(err)
            }
            if (direct) return res.sendFile(path.resolve(__dirname, 'static', `${fileName}.mp3`))
            res.send({ url: `${url}/${fileName}` })
        })
    }
}

function random(length) {
    let result = '';
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}