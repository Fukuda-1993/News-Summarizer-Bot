/**
 * メイン処理：プログラミング関連のRSSを取得し、要約してLINEに送る
 */
function main() {
  const rssUrls = [
    "https://rss.itmedia.co.jp/rss/2.0/ait.xml",     // AI・プログラミング
  ];
  
  console.log("ニュース取得を開始");

  for (const url of rssUrls) {
    try {
      const response = UrlFetchApp.fetch(url);
      const xmlText = response.getContentText();

      // <item>から</item>までを1つの塊としてすべて抽出
      const items = xmlText.match(/<item>[\s\S]*?<\/item>/g);

      if (!items) {
        console.warn("記事が見つかりませんでした: " + url);
        continue;
      }

      const maxItemsPerCategory = 2;
      
      for (let i = 0; i < Math.min(items.length, maxItemsPerCategory); i++) {
        const itemStr = items[i];

        // 各要素を正規表現で引っこ抜く
        const title = extractTagContent(itemStr, "title");
        const link = extractTagContent(itemStr, "link");
        const description = extractTagContent(itemStr, "description");

        if (description) {
          console.log("要約作成中: " + title);
          const summary = askGroq(description); 

          const message = `
【最新：${title}】

${summary}

▼ 記事をチェックする
${link}
          `.trim();

          sendToLine(message);
          Utilities.sleep(1500);
        }
      }
    } catch (e) {
      console.error("URL取得エラー (" + url + "): " + e.toString());
    }
  }
  console.log("すべての処理が完了しました！");
}

/**
 * 文字列から特定のタグの中身を抽出する補助関数
 */
function extractTagContent(text, tagName) {
  const regex = new RegExp("<" + tagName + "[^>]*>([\\s\\S]*?)<\\/" + tagName + ">", "i");
  const match = text.match(regex);
  if (match && match[1]) {
    // CDATA（<![CDATA[...]]>）が含まれている場合は中身だけ取る
    let content = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
    // HTMLエンティティなどを簡易的に戻す
    return content.trim();
  }
  
  // <link>タグなどの閉じタグがない特殊ケースへの対応
  if (tagName === "link") {
    const linkMatch = text.match(/<link[^>]*>([\s\S]*?)(\s|$|<)/i);
    return linkMatch ? linkMatch[1].trim() : "";
  }
  
  return "";
}