// Highly popular, long-standing videos. Almost certain to have caption tracks (including auto-generated).
// Individual video disappearance is buffered by the verdict threshold (>= half pass).
export const CAPTION_FIXTURES = [
  'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
  '9bZkp7q19f0', // PSY - GANGNAM STYLE
  'kJQP7kiw5Fk', // Luis Fonsi - Despacito ft. Daddy Yankee
  'JGwWNGJdvx8', // Ed Sheeran - Shape of You
]

// Search queries visited by the DOM canary (thumbnails must appear).
export const DOM_SEARCH_QUERIES = ['news', 'music']

// Surfaces visited by the DOM canary, judged separately by aggregateDom.
// Anonymous home renders no video links; its probes are never usable.
export const DOM_PROBE_TARGETS = [
  ...DOM_SEARCH_QUERIES.map(query => ({
    surface: 'search',
    label: `search:${query}`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query,
    )}&hl=en&gl=US`,
  })),
  {
    surface: 'home',
    label: 'home',
    url: 'https://www.youtube.com/?hl=en&gl=US',
  },
  {
    surface: 'channel',
    label: 'channel:@YouTube',
    url: 'https://www.youtube.com/@YouTube/videos?hl=en&gl=US',
  },
  {
    surface: 'watch',
    label: `watch:${CAPTION_FIXTURES[0]}`,
    url: `https://www.youtube.com/watch?v=${CAPTION_FIXTURES[0]}&hl=en&gl=US`,
  },
]
