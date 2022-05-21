const moment = require('moment');
const canvas = require("discord-canvas");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");

const name = 'message'
const prefix = '!'

db.run("CREATE TABLE if not exists data \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guild TEXT, channel TEXT, gamemode TEXT, colorcode TEXT)");


const handler = message => {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)

    if (command === 'tcc') {
        const [gamemode] = args.map(str => Number(str))
        const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
        const guildId = message.guild.id;
        const channelId = message.channel.id;
        const colorcode = '393e46'

        db.run(`INSERT INTO data(date, guild, channel, gamemode, colorcode) \
            VALUES("${date}", ${guildId}, "${channelId}", "${gamemode}", "${colorcode}")`);
        // message.channel.send(`${a} + ${b} = ${a + b}`)
    }

    if (message.content.match(/やあ/)) {
        let text = "黙れ";
        message.channel.send(text);
        return;
    }
}

module.exports = { name, handler }