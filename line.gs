/**
 * LINE Messaging APIでメッセージを送信する
 * @param {string} message - 送信する本文（タイトル、要約、URLが含まれた状態）
 */
function sendToLine(message) {
  const url = "https://api.line.me/v2/bot/message/push";
  
  // CONFIGオブジェクト（Config.gsで定義しているもの）を使用
  const payload = {
    "to": CONFIG.LINE_USER_ID,
    "messages": [
      {
        "type": "text",
        "text": message // Main.gsで組み立てた文章をそのまま送る
      }
    ]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + CONFIG.LINE_TOKEN
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const resCode = response.getResponseCode();
    
    if (resCode === 200) {
      console.log("LINE送信成功");
    } else {
      console.error("LINE送信失敗（エラーコード）: " + resCode + " 内容: " + response.getContentText());
    }
  } catch (e) {
    console.error("LINE送信エラー: " + e.toString());
  }
}