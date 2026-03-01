/**
 * プロジェクト全体の設定を管理するオブジェクト
 */
const CONFIG = {
  // Groq　キー (スクリプトプロパティから取得)
  GROQ_API_KEY: PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY'),

  // LINE Messaging API チャネルアクセストークン
  LINE_TOKEN: PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN'),
  
  // 送信先のLINEユーザーID
  LINE_USER_ID: PropertiesService.getScriptProperties().getProperty('LINE_USER_ID'),
};