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