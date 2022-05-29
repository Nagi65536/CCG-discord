const moment = require('moment');
const sqlite3 = require("sqlite3");
const fs = require('fs');
const db = new sqlite3.Database("./main.db");


exports.removec = function () {
    const date = moment(moment().local().format('YYYY-MM-DD HH:mm:ss'));
    let reg_date = null;
    const tables = ['data', 'oneshot', 'dm']
    let diff;

    tables.forEach(ele => {
        db.each(`SELECT id, date FROM ${ele}`, (err, row) => {
            reg_date = moment(row.date);
            diff = date.diff(reg_date, 'hours');

            if (diff > 1) db.run(`DELETE from ${ele} WHERE id = ${row.id}`)
        });
    });

    db.each(`SELECT * FROM ccimages`, (err, row) => {
        reg_date = moment(row.date);
        diff = date.diff(reg_date, 'hours');

        if (diff >= 0) {
            try {
                db.run(`DELETE FROM ccimages WHERE id = ${row.id}`);
                fs.unlinkSync(`images/${row.colorcode}.png`);
                console.log('画像を削除しました', row.colorcode);
            } catch (e) {
                console.log('画像が見つかりません', row.colorcode);
            }
        }
    });
}

exports.removeall = function () {
    const date = moment(moment().local().format('YYYY-MM-DD HH:mm:ss'));
    let reg_date = null;
    const tables = ['data', 'oneshot', 'dm']

    fs.readdir('images', function (err, files) {
        files.forEach(file => {
            fs.unlink(`images/${file}`, function (err) {
                if (err) {
                    throw (err);
                }
                console.log(`deleted ${file}`);
            });
        });

        db.run(`DELETE FROM ccimages`);
        db.run(`DELETE FROM data`);
        db.run(`DELETE FROM dm`);
        db.run(`DELETE FROM oneshot`);
        db.run(`DELETE FROM winner`);
    });
}

exports.deldata = function (guildId) {
    db.run(`DELETE FROM * WHERE guildId = "${guildId}"`);
}
