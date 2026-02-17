# YT Caption Checker Aid

Versioni lingua: [English](README.md) · [한국어](README_KO.md) · [日本語](README_JA.md) · [简体中文](README_ZH_CN.md) · [Español](README_ES.md) · [Italiano](README_IT.md)

Estensione browser che verifica se un video YouTube ha sottotitoli nella lingua selezionata e mostra un badge sulla miniatura.

## Funzionalità
- Rileva miniature YouTube e mostra il badge sottotitoli
- Supporta molti codici lingua dei sottotitoli YouTube
- Unificazione varianti regionali (`en-US`, `en-GB` => `en`)
- Impostazioni popup con salvataggio automatico
- Shorts esclusi dal controllo

## Installazione (modalità sviluppatore)
1. Apri `chrome://extensions`
2. Attiva la modalità sviluppatore
3. Clicca “Carica estensione non pacchettizzata”
4. Seleziona la cartella del progetto

## Utilizzo
1. Apri YouTube
2. Apri il popup dell’estensione
3. Scegli lingua sottotitoli e stile tag
4. Se disponibili, vedrai `CC XX` sulla miniatura

## Note
- Il rilevamento sottotitoli usa più percorsi di fallback per affidabilità.
- Alcuni video possono limitare i metadati in base a regione o disponibilità.
