const http = require('http');
const moment = require('moment');
const querystring = require('querystring');
const discord = require('discord.js');
const sqlite3 = require("sqlite3");
const fs = require('fs');
const path = require('path');
const { scryptSync } = require('crypto');

let src = {};
fs.readdir('./src/.', (err, files) => {
    files.forEach(file => {
        base = path.basename(file, path.extname(file));
        src[base] = require('./src/' + file)
    });
});

const client = new discord.Client();
const db = new sqlite3.Database("./main.db");

db.run("CREATE TABLE if not exists data \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guildId TEXT, channelId TEXT, gamemode TEXT, colorcode TEXT)");

db.run("CREATE TABLE if not exists server \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guild TEXT)");

db.run("CREATE TABLE if not exists ccimages \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, colorcode TEXT)");

db.run("CREATE TABLE if not exists winner \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guildId TEXT, channelId TEXT, userId TEXT,userName TEXT)");

db.run("CREATE TABLE if not exists oneshot \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guildId TEXT, channelId TEXT, userId TEXT,userName TEXT, colorcode TEXT)");

db.run("CREATE TABLE if not exists dm \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, authorId TEXT, colorcode TEXT)");


http.createServer(function (req, res) {
    if (req.method == 'POST') {
        let data = "";
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            if (!data) {
                res.end("No post data");
                return;
            }
            let dataObject = querystring.parse(data);
            console.log("post:" + dataObject.type);
            if (dataObject.type == "wake") {
                console.log("Woke up in post");
                res.end();
                return;
            }
            res.end();
        });
    }
    else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Discord Bot is active now\n');
    }
}).listen(3000);

client.on('ready', message => {
    console.log('⚡︎ Bot準備完了');
    client.user.setPresence({ activity: { name: "That'sColorCode!!" }, status: "online" });
    src.remove.removeall();
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('message', message => {
    if (message.author.bot) return;
    const [command, ...args] = message.content.split(/\s+/)

    if (message.channel.type == 'dm') {
        if (command === 'start') {
            src.training.trainingDMStart(message);
        } else if (message.content.match(/fin/)) {
            src.finish.finDM(message);
        } else if (message.content.match('^#([a-fA-F0-9]{6})$')) {
            src.training.trainingDM(message);
        } else if (message.content.match('^.([a-fA-F0-9]{6})$')) {
            src.training.trainingDM(message);
        } else if (message.content.match('^#')) {
            message.react('❌')
            message.author.send('カラーコードじゃない!!!');
        } else if (message.content.match('^.')) {
            message.react('❌')
            message.author.send('カラーコードじゃない!!!');
        } else {
            src.remove.removec();
            message.author.send('>>> Please send "start" or ColorCode')
        }

    } else {
        src.winner.winnerc(message);
        if (command === '!tcc') {
          try {
            client.channels.cache.get("983869643628380210").send({
              embed: {
                color: 7506394,
                timestamp: new Date(),
                fields: [
                  {
                    name: "使用コマンド",
                    value: `${message.content}`
                  }
                ]
            }
        });
    } catch (e) {
        console.log(e.name);
    }
          
            if (args[0] == 'help') {
                src.help.helpc(message);
            } else if (args[0] == 'training' || args[0] === "0") {
                src.training.trainingStart(message);

            } else if (args[0] == 'oneshot' || args[0] === "1") {
                src.oneshot.oneshotc(message);

            } else if (args[0] == 'perfect' || args[0] === "2") {
                src.perfect.perfectc(message);

            } else if (args[0] == 'perfectH' || args[0] === "3") {
                src.perfect.perfectHc(message);

            } else if (args[0] == 'random') {
                src.random.randomc(message);

            }

        } else if (message.content.match('^#([a-fA-F0-9]{6})$')) {
            src.getcc.getcolorcodec(message);

        } else if (message.content.match('^#')) {
            message.react('❌')
            message.channel.send('カラーコードじゃない!!!');

        } else if (message.content.match('^.([a-fA-F0-9]{6})$')) {
            src.getcc.getcolorcodec(message);

        } else if (message.content.match('^.')) {
            message.react('❌')
            message.channel.send('カラーコードじゃない!!!');

        } else if (message.content.match(/check/)) {
            src.finish.checkc(message);
        } else if (message.content.match(/fin/)) {
            src.finish.finc(message);
        }
    }
});

client.on("guildCreate", guild => {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    const guildId = guild.id;
    db.run(`INSERT INTO server(date, guild) \
            VALUES("${date}", "${guildId}")`)

    try {
        client.channels.cache.get("977890366378364978").send({
            embed: {
                title: "サーバー参加Log",
                color: 7506394,
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "BOT-参加Log"
                },
                fields: [
                    {
                        name: "サーバー名/サーバーID",
                        value: `${guild.name} | (ID:${guild.id})`
                    },
                    {
                        name: "オーナー名/ownerID",
                        value: `${client.users.cache.get.name} | (ID:${guild.ownerID})`
                    }
                ]
            }
        });
    } catch (e) {
        console.log(e.name);
    }
});

client.on("guildDelete", guild => {
    const guildId = guild.id;
    try {
        src.remove.deldata(guildId);
    } catch (e) {
        console.log(e.name);
    }

    try {
        client.channels.cache.get("977890366378364978").send({
            embed: {
                title: "サーバー脱退Log",
                color: 0,
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "BOT-脱退Log"
                },
                fields: [
                    {
                        name: "サーバー名/サーバーID",
                        value: `${guild.name} | (ID:${guild.id})`
                    },
                    {
                        name: "オーナー名/ownerID",
                        value: `${client.users.cache.get.name} | (ID:${guild.ownerID})`
                    }
                ]
            }
        });
    } catch (e) {
        console.log(e.name);
    }
});

