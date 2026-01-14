const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cut')
        .setDescription('提出するカットの情報を送信します。')
        // ここをプルダウン形式にする
        .addStringOption(option =>
            option.setName('役職')
                .setDescription('役職を選択してください')
                .setRequired(true)
                .addChoices(
                    { name: 'L/O :pen_fountain:', value: 'L/O' },
                    { name: '原画 ✍️', value: '原画' },
                    { name: '彩色 🎨', value: '彩色' },
                    { name: '背景 🌳', value: '背景' },
                    { name: '撮影 🎥', value: '撮影' },
                ))
        .addStringOption(option =>
            option.setName('カット番号')
                .setDescription('カット番号を入力')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('メンション先')
                .setDescription('通知を送る相手を選択')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('備考')
                .setDescription('備考があれば入力（任意）')
                .setRequired(false)),

    async execute(interaction) {
        const role = interaction.options.getString('役職');
        const cutNumber = interaction.options.getString('カット番号');
        const targetUser = interaction.options.getUser('メンション先');
        const memo = interaction.options.getString('備考') || 'なし';

        // メッセージ送信（先ほど決めた3行のフォーマットに合わせます）
        await interaction.reply({
            content: `${targetUser}\n**__カット${cutNumber}__**が提出されました！\n${role}チェックをお願いします:raised_hands:\n備考：${memo}`
        });
    },
};