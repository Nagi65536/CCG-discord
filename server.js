const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./main.db");

// TODO: データベースの構造の決定
// db.run("create table if not exists data(name, age)");
// db.run("INSERT INTO data(name, age) values(?,?)", "hoge", 33);
// db.each("select * from members", (err, row) => {
//     console.log(`${row.name} ${row.age}`);
// });

// db.close();

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

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log('DISCORD_BOT_TOKENが設定されていません。');
    process.exit(0);
}

client.on('message', message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.isMemberMentioned(client.user)) {
        sendReply(message, "うるせえ");
        return;
    }
    if (message.content.match(/やあ/)) {
        let text = "黙れ";
        sendMsg(message.channel.id, text);
        return;
    }
});

function sendReply(message, text) {
    message.reply(text)
        .then(console.log("リプライ送信: " + text))
        .catch(console.error);
}

function sendMsg(channelId, text, option = {}) {
    client.channels.get(channelId).send(text, option)
        .then(console.log("メッセージ送信: " + text))
        .catch(console.error);
}

function generateCC() {
    rgb10 = []
    rgb16 = []
    for (let i = 0; i < 3; i++) {
        rgb10[i] = Math.floor(Math.random() * 256);
        rgb16[i] = rgb10[i].toString(16);
    }
    canswer_color_code = '';

    for (let i = 0; i < rgb16.length; i++) {
        canswer_color_code += zeroPadding(rgb16[i], 2);
    }

    color_space.style.backgroundColor = `#${canswer_color_code}`;
}

function checkCC() {
    input_value = color_code.value.toLowerCase();

    let input_rgb10 = []
    let input_rgb16 = []
    let point = 0;

    for (let i = 0; i < 3; i++) {
        input_rgb10[i] = parseInt(input_value.substring(2 * i, 2 * i + 2), 16);
        input_rgb16[i] = input_rgb10[i].toString(16)
        point += Math.abs(input_rgb10[i] - rgb10[i])
    }

    if (isNaN(point)) {
        res_err.innerText = '入力が間違っています';
        res_r.innerText = '';
        res_g.innerText = '';
        res_b.innerText = '';

        answer_code.innerText = '';
        canswer_code.innerText = '';
        answer_color.style.backgroundColor = '#fff';
        canswer_color.style.backgroundColor = '#fff';
    } else {
        res_err.innerText = point;
        res_r.innerText = rgb10[0] - input_rgb10[0];
        res_g.innerText = rgb10[1] - input_rgb10[1];
        res_b.innerText = rgb10[2] - input_rgb10[2];

        answer_color_code = '';
        for (let i = 0; i < rgb16.length; i++) {
            answer_color_code += zeroPadding(input_rgb16[i], 2);
        }

        answer_code.innerText = `#${answer_color_code}`;
        canswer_code.innerText = `#${canswer_color_code}`;
        answer_color.style.backgroundColor = `#${answer_color_code}`;
        canswer_color.style.backgroundColor = `#${canswer_color_code}`;
        console.log(rgb16);
    }
}