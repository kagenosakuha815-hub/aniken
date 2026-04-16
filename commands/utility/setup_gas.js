const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { saveServerConfig } = require('../../configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_gas')
        .setDescription('このサーバー専用のGAS URLを設定します')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('GASの「ウェブアプリURL」を入力してください')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('作品名')
                .setDescription('このプロジェクトの名称（例：作品A）')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // 管理者のみ実行可能

    async execute(interaction) {
        const url = interaction.options.getString('url');
        const projectName = interaction.options.getString('作品名');
        const guildId = interaction.guildId;

        // 保存処理を実行
        const success = saveServerConfig(guildId, url, projectName);

        if (success) {
            await interaction.reply({
                content: `✅ **初期設定が完了しました！**\n**作品名:** ${projectName}\n**サーバーID:** ${guildId}\n今後、このサーバーでの報告はこのURLへ送信されます。`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `❌ 設定の保存中にエラーが発生しました。`,
                ephemeral: true
            });
        }
    }
};
