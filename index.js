const http = require('http');

// Renderのポートチェック用
http.createServer(function (req, res) {
  res.write("Bot is online!");
  res.end();
}).listen(process.env.PORT || 8080);

const fs = require('node:fs');
const path = require('node:path');
// 【修正】MessageFlags を追加
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');

const config = require('./config.json');
// 【重要】Render上の環境変数名に合わせて調整してください
const token = process.env.TOKEN_GOES_HERE || config.token;

const client = new Client({ intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b) });

client.commands = new Collection();

client.on('ready', () => {
    console.log(`${client.user.tag}でログインしました。準備完了！`);
});

const foldersPath = path.join(__dirname, 'commands');
if (fs.existsSync(foldersPath)) {
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            }
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    
    // ログを出してどこで止まっているか確認できるようにする
    console.log(`コマンド受信: ${interaction.commandName}`);

    if (!command) {
        console.error(`${interaction.commandName} に一致するコマンドが見つかりませんでした。`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error("実行エラー:", error);
        const errorContent = { content: '実行中にエラーが発生しました！', flags: MessageFlags.Ephemeral };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorContent);
        } else {
            await interaction.reply(errorContent);
        }
    }
});

// ログイン失敗を検知できるようにする
client.login(token).catch(err => {
    console.error("ログインに失敗しました。トークンを確認してください:", err.message);
});