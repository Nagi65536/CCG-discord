const moment = require('moment');
const sqlite3 = require("sqlite3");
const fs = require('fs');
const db = new sqlite3.Database("./main.db");

exports.removec = function () {
    const date = moment().local().format('YYYY-MM-DD HH:mm:ss');
    let reg_date = null;
    let diff = null;
    const tables = ['data', 'oneshot']

    tables.forEach(ele => {
        db.each(`SELECT id, date FROM ${ele}`, (err, row) => {
            reg_date = moment(row.date);
            diff = date.diff(reg_date, 'hours');

            if (diff > 2) db.run(`DELETE from ${ele} WHERE id = ${row.id}`)
        });
    });

    db.each(`SELECT id, colorcode FROM data`, (err, row) => {
        reg_date = moment(row.date);
        diff = date.diff(reg_date, 'hours');

        if (diff > 2) {
            db.run(`DELETE from data WHERE id = ${row.id}`);
            fs.unlinkSync(`images/${row.colorcode}.png`);
        }
    });
}


exports.deldata = function(guildId) {
    db.run(`DELETE FROM * WHERE guildId = "${guildId}"`);
}
