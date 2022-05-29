const generatecc = require('./generatecc')

exports.randomc = function (message) {
    const [command, ...args] = message.content.split(/\s+/)
    let count = Number(args[1]) || 1;
    if (count > 5) count = 5;
    else if (count < 0) count = 1
    
    for (let i = 0; i < count; i++) {
        generatecc.generateCCImage(message);
    }
}