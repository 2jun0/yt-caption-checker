const utils = require('./utils')

const BASE_URL = 'https://www.youtube.com/watch?v='

const jsonClosingChars = /^[)\]}'\s]+/
function parseJSON(source, varName, json) {
  if (!json || typeof json === 'object') return json

  try {
    json = json.replace(jsonClosingChars, '')
    return JSON.parse(json)
  } catch (err) {
    throw Error(`Error parsing ${varName} in ${source}: ${err.message}`)
  }
}

function findJSON(source, varName, body, left, right, prependJSON) {
  let jsonStr = utils.between(body, left, right)
  if (!jsonStr) throw Error(`Could not find ${varName} in ${source}`)

  return parseJSON(
    source,
    varName,
    utils.cutAfterJSON(`${prependJSON}${jsonStr}`),
  )
}

function getWatchHTMLURL(id, options) {
  return `${BASE_URL + id}&hl=${options.lang || 'en'}`
}

function getWatchHTMLPageBody(id, options) {
  const url = getWatchHTMLURL(id, options)
  return fetch(url, options).then(res => res.text())
}

async function getWatchHTMLPage(id, options) {
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

function findPlayerResponse(source, info) {
  const player_response =
    info &&
    ((info.args && info.args.player_response) ||
      info.player_response ||
      info.playerResponse ||
      info.embedded_player_response)
  return parseJSON(source, 'player_response', player_response)
}

export function getYtInfo(id, options) {
  return getWatchHTMLPage(id, options ? options : {})
}
