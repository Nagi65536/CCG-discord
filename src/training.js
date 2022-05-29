const moment = require('moment');
const sqlite3 = require("sqlite3");
const generatecc = require("./generatecc.js");
const finish = require("./finish.js");
const db = new sqlite3.Database("./main.db");


exports.trainingc = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const colorcodeA = message.content.substring(1, 7).toLowerCase();

        db.get(`SELECT * FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`, (err, row) => {
            const { r, g, b, point } = finish.compare_cc(row.colorcode, colorcodeA);
            const text = `正解 #${row.colorcode}\n回答 #${colorcodeA}\n >>> 誤差: ${sPadding(point, 4)}  R:${sPadding(r, 4)}  G:${sPadding(g, 4)}  B:${sPadding(b, 4)}`
            const colorcode = generatecc.generateCC(message, text);
            db.run(`UPDATE data SET date="${date}", colorcode="${colorcode}" WHERE guildId="${guildId}" AND channelId="${channelId}"`)
        });

    } catch (e) {
        message.channel.send('エラーが発生しました -trainingc');
    }
}

exports.trainingStart = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const gamemode = 'training';

        const text = `TRAINING START!!\nカラーコードを答えよ\n`
        const colorcode = generatecc.generateCC(message, text)

        db.run(`DELETE from data WHERE guildId="${guildId}" AND channelId="${channelId}"`);

        db.run(`INSERT INTO data(date, guildId, channelId, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

    } catch (e) {
        message.channel.send('エラーが発生しました -trainingStart')
    }
}

exports.trainingDM = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const authorId = message.author.id;
        const colorcodeA = message.content.substring(1, 7).toLowerCase();

        db.get(`SELECT * FROM dm WHERE authorId = ${authorId}`, (err, row) => {
            if (row) {
                const { r, g, b, point } = finish.compare_cc(row.colorcode, colorcodeA);
                const text = `正解 #${row.colorcode}\n回答 #${colorcodeA}\n >>> 誤差: ${sPadding(point, 4)}  R:${sPadding(r, 4)}  G:${sPadding(g, 4)}  B:${sPadding(b, 4)}`
                const colorcode = generatecc.generateCCdm(message, text);
                db.run(`UPDATE dm SET date="${date}", colorcode="${colorcode}" WHERE authorId="${authorId}"`)
            } else {
                generatecc.generateImagedm(message);
            }
        });

    } catch (e) {
        message.channel.send('エラーが発生しました -trainingDM');
    }
}

exports.trainingDMStart = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const authorId = message.author.id;
        const text = `TRAINING START!!\nカラーコードを答えよ\n`
        const colorcode = generatecc.generateCCdm(message, text)

        db.run(`DELETE from dm WHERE authorId="${authorId}"`);

        db.run(`INSERT INTO dm(date, authorId, colorcode) \
            VALUES("${date}", ${authorId}, "${colorcode}")`);

    } catch (e) {
        message.channel.send('エラーが発生しました -trainingDMstart')
    }
}

function sPadding(NUM, LEN) {
    return (Array(LEN).join(' ') + NUM).slice(-LEN);
}