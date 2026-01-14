const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remaining_cut')
        .setDescription('未チェックのカットを役職別に表示します'),

    async execute(interaction) {
        // ここを実際のチャンネルIDに書き換えてください
        const CHANNEL_ID = '1460235676271513652'; 
        const channel = interaction.guild.channels.cache.get(CHANNEL_ID);

        // チャンネルが見つからない場合のエラー回避
        if (!channel) {
            return await interaction.reply({ 
                content: '管理チャンネルが見つかりません。IDが正しいか確認してください。', 
                ephemeral: true 
            });
        }

        // 読み込み中であることを伝える
        await interaction.deferReply();

        try {
            const messages = await channel.messages.fetch({ limit: 100 });

            // ✅がないボットの投稿を抽出
            const unchecked = messages.filter(m => 
                m.author.id === interaction.client.user.id && 
                !m.reactions.cache.has('✅')
            );

            if (unchecked.size === 0) {
                return await interaction.editReply('現在、未チェックのカットはありません！✨');
            }

            const categorized = { 'L/O': [],'原画': [], '彩色': [], '背景': [], '撮影': [], 'その他': [] };

            unchecked.forEach(m => {
                const content = m.content;
                const cutNoMatch = content.match(/カット\s?([a-zA-Z0-9-]+)/);
                const cutNo = cutNoMatch ? cutNoMatch[1] : '不明';
                const link = `[${cutNo}](${m.url})`;

                if (content.includes('L/O')) categorized['L/O'].push(link);
                else if (content.includes('原画')) categorized['原画'].push(link);
                else if (content.includes('彩色')) categorized['彩色'].push(link);
                else if (content.includes('背景')) categorized['背景'].push(link);
                else if (content.includes('撮影')) categorized['撮影'].push(link);
                else categorized['その他'].push(link);
            });

            const embed = new EmbedBuilder()
                .setTitle('📌 未チェックカット一覧（役職別）')
                .setColor(0x00AE86)
                .setDescription('✅ リアクションがつくと一覧から消えます')
                .setTimestamp();

            for (const [role, cuts] of Object.entries(categorized)) {
                if (cuts.length > 0) {
                    embed.addFields({ name: `${role} (${cuts.length}件)`, value: cuts.join(', '), inline: false });
                }
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('メッセージの取得中にエラーが発生しました。');
        }
    },
};