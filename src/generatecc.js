exports.generateCC = function() {
    let rgb10 = []
    let rgb16 = []
    for (let i = 0; i < 3; i++) {
        rgb10[i] = Math.floor(Math.random() * 256);
        rgb16[i] = rgb10[i].toString(16);
    }
    let color_code = '';

    for (let i = 0; i < rgb16.length; i++) {
        color_code += zeroPadding(rgb16[i], 2);
    }
    
    return color_code;
}

function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}
