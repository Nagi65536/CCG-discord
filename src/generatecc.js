const moment = require('moment');
const sharp = require('sharp');
const sqlite3 = require('sqlite3');
const sleep = require('sleep');
const db = new sqlite3.Database('./main.db');
const fs = require('fs');


exports.generateCC = function (message, text) {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    let rgb10 = []
    let rgb16 = []
    for (let i = 0; i < 3; i++) {
        rgb10[i] = Math.floor(Math.random() * 256);
        rgb16[i] = rgb10[i].toString(16);
    }
    let colorcode = '';

    for (let i = 0; i < rgb16.length; i++) {
        colorcode += zeroPadding(rgb16[i], 2);
    }

    sharp({
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: { r: rgb10[0], g: rgb10[1], b: rgb10[2] }
        }
    }).toFile(`./images/${colorcode}.png`);
    const path = `./images/${colorcode}.png`
    while (true) {
        if (fs.existsSync(path)) {
            message.channel.send(text, { files: [path] });
            break
        } else {
            sleep.sleep(1)
        }
    }
    db.run(`UPDATE ccimages SET date="${date}" WHERE colorcode="${colorcode}"`);

    return colorcode;
}

exports.generateImage = function (message, colorcode) {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    let rgb10 = []
    let rgb16 = []

    for (let i = 0; i < 3; i++) {
        rgb10[i] = parseInt(colorcode.substring(2 * i, 2 * i + 2), 16);
        rgb16[i] = rgb10[i].toString(16)
    }
    sharp({
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: { r: rgb10[0], g: rgb10[1], b: rgb10[2] }
        }
    }).toFile(`./images/${colorcode}.png`);
    message.channel.send({ files: [`images/${colorcode}.png`] });

    db.run(`UPDATE ccimages SET date="${date}" WHERE colorcode="${colorcode}"`);
    db.run(`INSERT INTO ccimages(date, colorcode) VALUES  ("${date}", "${colorcode}")`);
}

exports.generateCCdm = function (message, text) {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    let rgb10 = []
    let rgb16 = []
    for (let i = 0; i < 3; i++) {
        rgb10[i] = Math.floor(Math.random() * 256);
        rgb16[i] = rgb10[i].toString(16);
    }
    let colorcode = '';

    for (let i = 0; i < rgb16.length; i++) {
        colorcode += zeroPadding(rgb16[i], 2);
    }

    sharp({
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: { r: rgb10[0], g: rgb10[1], b: rgb10[2] }
        }
    }).toFile(`./images/${colorcode}.png`);
    const path = `./images/${colorcode}.png`
    while (true) {
        if (fs.existsSync(path)) {
            message.author.send(text, { files: [path] });
            break
        } else {
            sleep.sleep(1)
        }
    }
    db.run(`INSERT INTO ccimages(date, colorcode) VALUES ("${date}", "${colorcode}")`);

    return colorcode;
}

function zeroPadding(NUM, LEN) {
    return (Array(LEN).join('0') + NUM).slice(-LEN);
}
