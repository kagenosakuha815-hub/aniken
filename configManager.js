const fs = require('fs');
const path = './serverConfig.json';

// JSONファイルから全サーバーの設定を読み込む
function loadAllConfig() {
    try {
        if (!fs.existsSync(path)) {
            // ファイルがなければ空のオブジェクトを作成
            fs.writeFileSync(path, JSON.stringify({}));
            return {};
        }
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data || '{}');
    } catch (error) {
        console.error("設定ファイルの読み込みに失敗しました:", error);
        return {};
    }
}

// 特定のサーバーの設定を取得する
function getServerConfig(guildId) {
    const config = loadAllConfig();
    return config[guildId] || null;
}

// 特定のサーバーの設定を保存・更新する
function saveServerConfig(guildId, gasUrl, projectName) {
    const config = loadAllConfig();
    
    // サーバーIDをキーにして保存
    config[guildId] = {
        gas_url: gasUrl,
        project_name: projectName,
        updated_at: new Date().toLocaleString('ja-JP')
    };

    try {
        fs.writeFileSync(path, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error("設定ファイルの保存に失敗しました:", error);
        return false;
    }
}

module.exports = { getServerConfig, saveServerConfig };