const moment = require('moment');
const training = require('./training.js');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");


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
        } else if (row.gamemode == 'training') {
            training.trainingc(message);
        }
    });
    message.react('🤔')
}
