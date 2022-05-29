const moment = require('moment');
const sqlite3 = require("sqlite3");
const generatecc = require("./generatecc.js");
const db = new sqlite3.Database("./main.db");


exports.perfectc = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const gamemode = 'perfect';

        const text = `PERFECT START!!!\nカラーコードを完璧に当てよ!`
        const colorcode = generatecc.generateCC(message, text)

        db.run(`DELETE from data WHERE guildId="${guildId}" AND channelId="${channelId}"`)

        db.run(`INSERT INTO data(date, guildId, channelId, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

    } catch (e) {
        message.channel.send('エラーが発生しました --perfectc')
    }
}

exports.perfectJudg = function (message) {
    
}