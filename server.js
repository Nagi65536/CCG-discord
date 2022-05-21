const http = require('http');
const moment = require('moment');
const querystring = require('querystring');
const discord = require('discord.js');
const events = require('./events.js')
const sqlite3 = require("sqlite3");
const client = new discord.Client();
const db = new sqlite3.Database("./main.db");

db.run("CREATE TABLE if not exists server \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, guild TEXT)");

events.forEach(({ name, handler }) => client.on(name, handler));

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        var data = "";
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            if (!data) {
                res.end("No post data");
                return;
            }
            var dataObject = querystring.parse(data);
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
    client.user.setPresence({ activity: { name: "I love COLOR CODE!!" }, status: "online" });
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on("guildCreate", guild => {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    const guildId = guild.id;
    db.run(`INSERT INTO server(date, guild) \
            VALUES("${date}", "${guildId}")`);

    try {
        client.channels.cache.get("977519789327126570").send({
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
        db.run(`DELETE FROM server WHERE guild = "${guildId}"`);
    } catch (e) {
        console.log(e.name);
    }

    try {
        client.channels.cache.get("977519789327126570").send({
            embed: {
                title: "サーバー脱退Log",
                color: 000000,
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

client.on('ready', message => {
    client.user.setPresence({ game: { name: 'ColorCode!! ' } });
});