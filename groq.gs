/**
 * Groq APIを使用してテキストを要約する
 * @param {string} text 要約対象のニュース本文
 * @return {string} 要約されたテキスト
 */
function askGroq(text) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('GROQ_API_KEY');
  
  if (!apiKey) {
    return "エラー：GROQ_API_KEYが設定されていません。";
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";
  
  // 現在、無料枠で確実に動く最新モデル名に変更
const payload = {
    "model": "llama-3.3-70b-versatile", 
    "messages": [
      {
        "role": "system",
        "content": "あなたは優秀なニュース編集者です。提供されたニュースをビジネスマン向けに、重要なポイント3点（各1行）で、簡潔な日本語で要約してください。余計な挨拶は不要です。"
      },
      {
        "role": "user",
        "content": text
      }
    ],
    "temperature": 0.3 // 数値を下げて、より正確でブレない要約に
  };

  const options = {
    "method": "post",
    "headers": {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    
    // 成功時：AIの回答を取り出す
    if (json.choices && json.choices.length > 0) {
      return json.choices[0].message.content.trim();
    } else {
      console.error("Groq詳細エラー: " + JSON.stringify(json));
      return "【AIエラー】無料枠の制限か、一時的な不具合です。";
    }
  } catch (e) {
    return "通信エラー：" + e.toString();
  }
}