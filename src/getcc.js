const moment = require('moment');
const training = require('./training.js');
const generatecc = require('./generatecc.js');
const oneshot = require('./oneshot.js');
const perfect = require('./perfect.js')
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
        if (row) {
            if (row.gamemode == 'training') {
                training.trainingc(message);

            } else if (row.gamemode == 'oneshot') {
                oneshot.oneshotRecord(message);

            } else if (row.gamemode == 'perfect') {
                perfect.perfectJudg(message);
                
            }
        } else {
            generatecc.generateImage(message, colorcode)
        }
    });
}
