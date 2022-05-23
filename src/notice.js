const moment = require('moment');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");

db.run("CREATE TABLE if not exists notice \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guildId TEXT, channelId TEXT)");

exports.noticeAdd = function (message) {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    const guildId = message.guild.id;
    const channelId = message.channel.id;

    db.each(`SELECT id FROM notice WHERE guildId = ${guildId}` , (err, row) => {
        if (row) db.run(`DELETE from data WHERE id = ${row.id}`)
    });

    db.run(`INSERT INTO notice(date, guildId, channelId) \
        VALUES("${date}", ${guildId}, "${channelId}")`);

    message.channel.send('ここにお知らせを送ります')
}

exports.noticeDel = function (guildId) {
    db.run(`DELETE from notice WHERE id = ${guildId}`)
}

exports.noticec = function (guildId) {
    if (guildId == ADMIN_GUILD){
        db.each(`SELECT * FROM notice WHERE guildId = ${guildId}` , (err, row) => {
            if (row) client.channels.cache.get(row.channelId)
                .send('お知らせの内容です');
        });
    }
}
