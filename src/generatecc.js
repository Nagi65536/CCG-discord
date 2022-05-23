const moment = require('moment');
const sqlite3 = require("sqlite3");
const sharp = require('sharp');
const db = new sqlite3.Database("./main.db");

db.run("CREATE TABLE if not exists ccimages \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, colorcode TEXT)");

exports.generateCC = function () {
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

    db.each(`SELECT * FROM ccimages WHERE colorcode=${colorcode}`, (err, row) => {
        if (row) {
            db.run(`UPDATE ccimages SET date="${date}" WHERE colorcode="${colorcode}"`);
        } else {
            sharp({
                create: {
                    width: 100,
                    height: 100,
                    channels: 3,
                    background: { r: rgb10[0], g: rgb10[1], b: rgb10[2] }
                }
            }).toFile(`./images/${colorcode}.png`)
        }
    });


    db.run(`INSERT INTO ccimages(date, colorcode) VALUES \
        ("${date}", "${colorcode}")`);

    return colorcode;
}

function zeroPadding(NUM, LEN) {
    return (Array(LEN).join('0') + NUM).slice(-LEN);
}
