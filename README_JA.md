# YT Caption Checker Aid

言語: [English](README.md) · [한국어](README_KO.md) · [日本語](README_JA.md) · [简体中文](README_ZH_CN.md) · [Español](README_ES.md) · [Italiano](README_IT.md)

選択した字幕言語が利用可能かを判定し、YouTube サムネイル上にバッジ表示するブラウザ拡張です。

## GitHub Copilot による作成
このプロジェクトは GitHub Copilot (GPT-5.3-Codex) により完全に作成されました。

## 主な機能
- YouTube サムネイル検出と字幕バッジ表示
- YouTube 字幕言語コードを幅広くサポート
- 地域バリエーション統合検索 (`en-US`, `en-GB` => `en`)
- ポップアップ設定の自動保存・即時反映
- Shorts は検出対象外

## インストール (開発者モード)
1. Chrome 拡張ページを開く: `chrome://extensions`
2. 開発者モードを有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このプロジェクトフォルダを選択

## 使い方
1. YouTube を開く
2. 拡張のポップアップを開く
3. 字幕言語とタグスタイルを選択
4. 字幕がある場合、サムネイルに `CC XX` が表示

## スクリーンショット
> 実際の画像は [assets/screenshots](assets/screenshots) に配置してください。

### ポップアップ
![Popup Settings](assets/screenshots/popup-settings.png)

### YouTube サムネイルバッジ
![YouTube Thumbnail Badge](assets/screenshots/youtube-thumbnails-badge.png)

## ライセンス
MIT

## 補足
- 字幕検出は信頼性向上のため複数のフォールバック経路を使用します。
- 動画や地域によって字幕メタデータの取得が制限される場合があります。
