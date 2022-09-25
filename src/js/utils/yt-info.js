import { parseJSON, findJSON } from './json.js'

const BASE_URL = 'https://www.youtube.com/watch?v='

const getWatchHTMLURL = (id, options) => {
  return `${BASE_URL + id}&hl=${options.lang || 'en'}`
}

const getWatchHTMLPageBody = async (id, options) => {
  const url = getWatchHTMLURL(id, options)
  const res = await fetch(url, options)
  return res.text()
}

const getWatchHTMLPage = async (id, options) => {
  let body = await getWatchHTMLPageBody(id, options)
  let info = { page: 'watch' }
  try {
    info.player_response = findJSON(
      'watch.html',
      'player_response',
      body,
      /\bytInitialPlayerResponse\s*=\s*\{/i,
      '</script>',
      '{',
    )
  } catch (err) {
    let args = findJSON(
      'watch.html',
      'player_response',
      body,
      /\bytplayer\.config\s*=\s*{/,
      '</script>',
      '{',
    )
    info.player_response = findPlayerResponse('watch.html', args)
  }

  return info
}

const findPlayerResponse = (source, info) => {
  const player_response =
    info &&
    ((info.args && info.args.player_response) ||
      info.player_response ||
      info.playerResponse ||
      info.embedded_player_response)
  return parseJSON(source, 'player_response', player_response)
}

export const getYtInfo = async id => {
  return await getWatchHTMLPage(id, { credentials: 'omit' })
}
