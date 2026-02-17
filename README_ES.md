# YT Caption Checker Aid

Versiones de idioma: [English](README.md) · [한국어](README_KO.md) · [日本語](README_JA.md) · [简体中文](README_ZH_CN.md) · [Español](README_ES.md) · [Italiano](README_IT.md)

Extensión de navegador que comprueba si un video de YouTube tiene subtítulos en el idioma seleccionado y muestra una etiqueta en la miniatura.

## Creado con GitHub Copilot
Este proyecto fue creado completamente con GitHub Copilot (GPT-5.3-Codex).

## Funciones
- Detecta miniaturas de YouTube y añade etiqueta de subtítulos
- Soporta una gran cantidad de códigos de idioma de subtítulos
- Opción de unificación regional (`en-US`, `en-GB` => `en`)
- Configuración en popup con guardado automático
- Excluye Shorts

## Instalación (modo desarrollador)
1. Abre `chrome://extensions`
2. Activa el modo desarrollador
3. Haz clic en “Cargar descomprimida”
4. Selecciona esta carpeta del proyecto

## Uso
1. Abre YouTube
2. Abre el popup de la extensión
3. Elige idioma de subtítulos y estilo
4. Si hay subtítulos, verás `CC XX` en la miniatura

## Capturas de pantalla
> Coloca las imágenes reales en [assets/screenshots](assets/screenshots).

### Popup
![Popup Settings](assets/screenshots/popup-settings.png)

### Etiqueta en miniatura de YouTube
![YouTube Thumbnail Badge](assets/screenshots/youtube-thumbnails-badge.png)

## Licencia
MIT

## Notas
- La detección de subtítulos usa varias rutas de respaldo para mejorar la estabilidad.
- Algunos videos pueden limitar metadatos según región o disponibilidad.
