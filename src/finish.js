const moment = require('moment');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");

exports.checkc = function (message) {
    const guildId = message.guild.id;
    const channelId = message.channel.id;

    db.get(`SELECT * FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`, (err, row) => {
        if (row.gamemode == 'oneshot') {
            aggregation('oneshot', message, row, guildId, channelId);
        }
    });
}

exports.finc = function (message) {
    const guildId = message.guild.id;
    const channelId = message.channel.id;
    const tables = [data, oneshot]
    
    tables.forEach(ele => {
        db.run(`DELETE FROM ${ele} WHERE guildId="${guildId}" AND channelId="${channelId}"`);
    })
    
    message.channel.send('強制終了しました');
}

function sPadding(NUM, LEN) {
    return (Array(LEN).join(' ') + NUM).slice(-LEN);
}

function aggregation(gamemode, message, row) {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    const guildId = message.guild.id;
    const channelId = message.channel.id;
    const colorcodeC = row.colorcode;
    let rgb10C = [];
    let rgb16C = [];

    for (let i = 0; i < 3; i++) {
        rgb10C[i] = parseInt(colorcodeC.substring(2 * i, 2 * i + 2), 16);
        rgb16C[i] = rgb10C[i].toString(16)
    }

    let colorcodeA = null;
    let rgb10A = [];
    let rgb16A = [];
    let res = [];

    db.all(`SELECT * FROM ${gamemode} WHERE guildId = ${guildId} AND channelId = ${channelId}`, (err, row2) => {
        row2.forEach(element => {
            colorcodeA = element.colorcode;

            for (let i = 0; i < 3; i++) {
                rgb10A[i] = parseInt(colorcodeA.substring(2 * i, 2 * i + 2), 16);
                rgb16A[i] = rgb10A[i].toString(16)
            }

            res.push({
                userName: element.userName,
                userId: element.userId,
                colorcode: colorcodeA,
                rgb10: rgb10A,
                rgb16: rgb16A,
                mep: [rgb10C[0] - rgb10A[0], rgb10C[1] - rgb10A[1], rgb10C[2] - rgb10A[2]],
                point: Math.abs(rgb10C[0] - rgb10A[0]) + Math.abs(rgb10C[1] - rgb10A[1] + Math.abs(rgb10C[2] - rgb10A[2])),
            });
        });

        if (res.length > 0) {

            res.sort((a, b) => a.point - b.point);
            let text = `結果  #__${colorcodeC}__   --oneshot-- \n >>> `;
            res.forEach((e, i) => {
                text += `**${i + 1}**位 ${sPadding(e.point, 4)}点 ${e.userName}
    #__${e.colorcode}__    R: ${sPadding(e.mep[0], 4)}   G: ${sPadding(e.mep[1], 4)}   B: ${sPadding(e.mep[2], 4)}\n`
            })
            message.channel.send(text)
            db.run(`DELETE FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`);
            db.run(`DELETE FROM ${gamemode} WHERE guildId = ${guildId} AND channelId = ${channelId}`);
            db.run(`DELETE FROM winner WHERE guildId = ${guildId} AND channelId = ${channelId}`);
            db.run(`INSERT INTO winner(date, guildId, channelId, userId, userName) VALUES("${date}", "${guildId}", "${channelId}", "${res[0].userId}", "${res[0].userName}")`);
        } else {
            message.react('🥺')
            message.channel.send('だれも...');
        }
    });
}
