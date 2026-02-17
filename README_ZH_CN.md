# YT Caption Checker Aid

语言版本: [English](README.md) · [한국어](README_KO.md) · [日本語](README_JA.md) · [简体中文](README_ZH_CN.md) · [Español](README_ES.md) · [Italiano](README_IT.md)

这是一个浏览器扩展，用于检查 YouTube 视频是否提供所选字幕语言，并在缩略图上显示标签。

## 功能
- 检测 YouTube 缩略图并显示字幕标签
- 支持大量 YouTube 字幕语言代码
- 支持地区语言合并搜索（`en-US`, `en-GB` => `en`）
- 弹窗设置自动保存并即时生效
- 不处理 Shorts

## 安装（开发者模式）
1. 打开 Chrome 扩展页面: `chrome://extensions`
2. 启用开发者模式
3. 点击“加载已解压的扩展程序”
4. 选择本项目文件夹

## 使用方法
1. 打开 YouTube
2. 打开扩展弹窗
3. 选择字幕语言和标签样式
4. 若有字幕，缩略图将显示 `CC XX`

## 说明
- 为了提高稳定性，字幕检测使用多级回退路径。
- 某些视频会因地区或权限限制无法返回完整字幕元数据。
