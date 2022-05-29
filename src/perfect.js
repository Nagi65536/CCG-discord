const moment = require('moment');
const sqlite3 = require("sqlite3");
const generatecc = require("./generatecc.js");
const finish = require('./finish.js');
const db = new sqlite3.Database("./main.db");


exports.perfectc = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const gamemode = 'perfect';

        const text = `PERFECT START!!!\nカラーコードを完璧に当てよ!`
        const colorcode = generatecc.generateCC(message, text)

        db.run(`DELETE from data WHERE guildId="${guildId}" AND channelId="${channelId}"`)

        db.run(`INSERT INTO data(date, guildId, channelId, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

    } catch (e) {
        message.channel.send('エラーが発生しました --perfectc')
    }
}

exports.perfectHc = function (message) {
    try {
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const gamemode = 'perfectH';

        const text = `PERFECT HARD START!!!\nカラーコードを完璧に当てよ!`
        const colorcode = generatecc.generateCC(message, text)

        db.run(`DELETE from data WHERE guildId="${guildId}" AND channelId="${channelId}"`)

        db.run(`INSERT INTO data(date, guildId, channelId, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);

    } catch (e) {
        message.channel.send('エラーが発生しました --perfectc')
    }
}

exports.perfectJudg = function (message) {
    const colorcodeA = message.content.substring(1, 7);
    const guildId = message.guild.id;
    const channelId = message.channel.id;

    db.each(`SELECT * FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`, (err, row) => {
        const colorcodeC = row.colorcode;

        const { r, g, b, point } = finish.compare_cc(colorcodeC, colorcodeA);
        const judge = [r, g, b];
        let text = `#${colorcodeA}\n`;

        for (let i = 0; i < 3; i++) {
            if (judge[i] > 0) text += '🔽';
            else if (judge[i] < 0) text += '🔼';
            else text += '⏺️';
            text += ' ';
        }

        message.channel.send(text)
        if (point == 0) {
            const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
            const userId = message.author.id;
            const userName = message.author.username;
            const text = `" ${userName} " is WIN!!`
            message.channel.send(text)

            db.run(`DELETE FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`);
            db.run(`DELETE FROM winner WHERE guildId = ${guildId} AND channelId = ${channelId}`);
            db.run(`INSERT INTO winner(date, guildId, channelId, userId, userName) VALUES("${date}", "${guildId}", "${channelId}", "${userId}", "${userName}")`);
        }
    });
}

exports.perfectJudgH = function (message) {
    const colorcodeA = message.content.substring(1, 7);
    const guildId = message.guild.id;
    const channelId = message.channel.id;

    db.each(`SELECT * FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`, (err, row) => {
        const colorcodeC = row.colorcode;

        const { point } = finish.compare_cc(colorcodeC, colorcodeA);

        if (point != 0) {
            message.channel.send(`#${colorcodeA} ❌`);

        } else {
            const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
            const userId = message.author.id;
            const userName = message.author.username;
            message.channel.send(`#${colorcodeA} ⭕\n" ${userName} " is WIN!!`);

            db.run(`DELETE FROM data WHERE guildId = ${guildId} AND channelId = ${channelId}`);
            db.run(`DELETE FROM winner WHERE guildId = ${guildId} AND channelId = ${channelId}`);
            db.run(`INSERT INTO winner(date, guildId, channelId, userId, userName) VALUES("${date}", "${guildId}", "${channelId}", "${userId}", "${userName}")`);
        }
    });
}
