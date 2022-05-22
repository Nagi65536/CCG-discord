const moment = require('moment');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");


db.run("CREATE TABLE if not exists oneshot \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guildId TEXT, channelId TEXT, userId TEXT,userName TEXT, colorcode TEXT)");


exports.getcolorcodec = function (message) {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    const guildId = message.guild.id;
    const channelId = message.channel.id;
    const userId = message.author.id;
    const userName = message.author.username;
    const colorcode = message.content.substr(1, 6);

    db.get(`SELECT * FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`, (err, row) => {
        if (row.gamemode == 'oneshot') {
            db.each(`SELECT * FROM oneshot WHERE guildId = ${guildId} AND channelId = ${channelId} AND userId = ${userId}`, (err, row2) => {
                db.run(`DELETE FROM oneshot WHERE id = ${row2.id}`);
            });
            db.run(`INSERT INTO oneshot(date, guildId, channelId, userId, userName, colorcode) \
                VALUES("${date}", ${guildId}, "${channelId}", "${userId}", "${userName}", "${colorcode}")`);
        }
    });
    message.react('🤔')
}