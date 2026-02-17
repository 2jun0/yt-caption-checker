# YT Caption Checker Aid

Language versions: [English](README.md) · [한국어](README_KO.md) · [日本語](README_JA.md) · [简体中文](README_ZH_CN.md) · [Español](README_ES.md) · [Italiano](README_IT.md)

A browser extension that checks whether a YouTube video has captions in your selected language and shows a badge on thumbnails.

## Built with GitHub Copilot
This project was fully created with GitHub Copilot (GPT-5.3-Codex).

## Features
- Detects YouTube video thumbnails and adds a caption badge
- Supports a wide range of YouTube caption language codes
- Optional regional-language unification (e.g. `en-US` + `en-GB` => `en`)
- Live settings in popup (auto-save)
- Excludes Shorts from badge processing

## Installation (Developer Mode)
1. Open Chrome extensions page: `chrome://extensions`
2. Turn on Developer mode
3. Click Load unpacked
4. Select this project folder

## Usage
1. Open YouTube
2. Open extension popup
3. Choose caption language and style options
4. Thumbnail badges appear as `CC XX` when captions are available

## Screenshots
> You can place real images in [assets/screenshots](assets/screenshots) and they will show below.

### Popup
![Popup Settings](assets/screenshots/popup-settings.png)

### YouTube Thumbnail Badge
![YouTube Thumbnail Badge](assets/screenshots/youtube-thumbnails-badge.png)

## License
MIT

## Notes
- Caption detection uses multiple fallback paths for reliability.
- Some videos may have restricted metadata depending on region or availability.
