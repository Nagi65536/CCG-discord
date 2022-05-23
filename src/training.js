const moment = require('moment');
const sqlite3 = require("sqlite3");
const generatecc = require("./generatecc.js");
const db = new sqlite3.Database("./main.db");


exports.trainingc = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const colorcode = generatecc.generateCC();

        db.run(`UPDATE data SET date="${date}", colorcode=${colorcode} WHERE guildId="${guildId}" AND channelId="${channelId}"`);

    } catch (e) {
        message.channel.send('エラーが発生しました');
    }
}

exports.trainingStart = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const colorcode = generatecc.generateCC()
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const gamemode = 'training';
        
        db.run(`DELETE from data WHERE guildId="${guildId}" AND channelId="${channelId}"`);
        
        db.run(`INSERT INTO data(date, guildId, channelId, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

        message.channel.send(
            `\\\\\\トレーニング開始！///\nカラーコードを答えよ\n`,
            { files: [`./images/${colorcode}.png`] }
        );
    } catch (e) {
        message.channel.send('エラーが発生しました')
    }
}