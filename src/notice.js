const moment = require('moment');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");

db.run("CREATE TABLE if not exists notice \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guildId TEXT, channelId TEXT)");

exports.noticeAdd = function (message) {
    const guildId = message.guild.id;
    const channelId = message.channel.id;

    db.each(`SELECT id FROM notice WHERE guildId = ${guildId} AND channelId = ${channelId}` , (err, row) => {
        if (row) db.run(`DELETE from data WHERE id = ${row.id}`)
    });

    db.run(`INSERT INTO notice(date, guildId, channelId) \
        VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

    message.channel.send('ここにお知らせを送ります')
}

exports.noticec = function (message) {
    const guildId = message.guild.id;
    const channelId = message.channel.id;
}