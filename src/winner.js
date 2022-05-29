const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");



exports.winnerc = function (message) {
    const guildId = message.guild.id;
    const channelId = message.channel.id;
    const userId = message.author.id;
    const userName = message.author.username

    db.get(`SELECT * FROM winner WHERE guildId = ${guildId} AND channelId = ${channelId} AND userId = ${userId}`, (err, row) => {
        if (row) {
            message.react('⬜')
            message.react('🟨')
            message.react('🟧')
            message.react('🟦')
            message.react('🟥')
            db.run(`DELETE FROM winner WHERE guildId = ${guildId} AND channelId = ${channelId}`);
        }
    });
}