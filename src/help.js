exports.helpc = function (message) {
    message.channel.send(
        `help を表示\`\`\`\n
> コマンド
    !tcc [gamemode]
      指定したゲームを開始します
      
    !tcc notice (rm)
      実行されたチャンネルにお知らせを送ります
      "rm" をつけるとお知らせを停止します
    
    !tcc help
      ヘルプを表示します
    
    #[colorcode]
      入力された色を表示します
      ゲーム中はカラーコードを指定することができます
      
> colorcode  -半角数字と半角英字(a~f)が使用できます

> gamemode  -数字またはゲーム名を指定してください
    0. training
      回答したら次の問題がきます
      "fin" を入力すると終了します
    1. oneshot
      一人一つカラーコードを入力し、誤差が小さい人が勝ちです
      "check" を入力すると結果が表示されます

    2. perfect
      カラーコードをピッタリ入力した人が勝ちです
    
    3. perfect hard
      perfect のヒントなしです
    \`\`\` `
    )
}
