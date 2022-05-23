const moment = require('moment');
const sqlite3 = require("sqlite3");
const generatecc = require("./generatecc.js");
const db = new sqlite3.Database("./main.db");


db.run("CREATE TABLE if not exists oneshot \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guildId TEXT, channelId TEXT, userId TEXT,userName TEXT, colorcode TEXT)");


exports.oneshotc = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const gamemode = 'oneshot';
        const colorcode = generatecc.generateCC()
        
        db.each(`SELECT id FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}` , (err, row) => {
            if (row) db.run(`DELETE from data WHERE id = ${row.id}`)
        });

        db.run(`INSERT INTO data(date, guildId, channelId, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

        message.channel.send(
            `\\\\\\ ONE SHOT START!!! ///\nカラーコードを一発で当てよ!`,
            { files: [`./images/${colorcode}.png`] }
        )
    } catch (e) {
        message.channel.send('エラーが発生しました')
    }
}
