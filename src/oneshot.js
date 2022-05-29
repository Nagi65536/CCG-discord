const moment = require('moment');
const sqlite3 = require("sqlite3");
const generatecc = require("./generatecc.js");
const db = new sqlite3.Database("./main.db");


exports.oneshotc = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const gamemode = 'oneshot';
        
        const text = `ONE SHOT START!!!\nカラーコードを一発で当てよ!`
        const colorcode = generatecc.generateCC(message, text)
        
        db.run(`DELETE from data WHERE guildId="${guildId}" AND channelId="${channelId}"`)

        db.run(`INSERT INTO data(date, guildId, channelId, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

    } catch (e) {
        message.channel.send('エラーが発生しました')
    }
}

exports.oneshotRecord = function (message) {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    const guildId = message.guild.id;
    const channelId = message.channel.id;
    const userId = message.author.id;
    const userName = message.author.username;
    const colorcode = message.content.substr(1, 6);
    
    db.each(`SELECT * FROM oneshot WHERE guildId = ${guildId} AND channelId = ${channelId} AND userId = ${userId}`, (err, row2) => {
        db.run(`DELETE FROM oneshot WHERE id = ${row2.id}`);
    });
    db.run(`INSERT INTO oneshot(date, guildId, channelId, userId, userName, colorcode) \
    VALUES("${date}", ${guildId}, "${channelId}", "${userId}", "${userName}", "${colorcode}")`);
    message.react('🤔');
}