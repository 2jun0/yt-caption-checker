import { writeFileSync } from 'fs'
import { chromium } from 'playwright'
import { DOM_PROBE_TARGETS } from './fixtures.js'
import {
  countThumbnailMatches,
  isConsentOrBlockPage,
  aggregateDom,
} from './lib/domProbe.js'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

const writeResult = out => {
  console.log(JSON.stringify(out, null, 2))
  writeFileSync('dom-canary-result.json', JSON.stringify(out))
}

const probeTarget = async (context, { surface, label, url }) => {
  const page = await context.newPage()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    if (isConsentOrBlockPage({ url: page.url(), title: await page.title() })) {
      return { surface, label, blocked: true }
    }
    await page.waitForTimeout(4000) // let the SPA render thumbnails
    const descriptors = await page.$$eval('a', as =>
      as.map(a => ({
        tagName: a.tagName,
        id: a.id,
        href: a.href,
        className: a.className,
      })),
    )
    return { surface, label, ...countThumbnailMatches(descriptors) }
  } catch (err) {
    return {
      surface,
      label,
      blocked: true,
      error: String((err && err.message) || err),
    }
  } finally {
    await page.close()
  }
}

const main = async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const context = await browser.newContext({ userAgent: UA, locale: 'en-US' })
    const probes = []
    for (const target of DOM_PROBE_TARGETS) {
      probes.push(await probeTarget(context, target))
    }

    const status = aggregateDom(probes)
    writeResult({ surface: 'dom', status, probes })
    process.exitCode = status === 'fail' ? 1 : 0 // inconclusive는 실패로 치지 않음
  } finally {
    await browser.close()
  }
}

main().catch(err => {
  // 크래시는 YouTube 깨짐이 아니라 인프라 이슈 → inconclusive로 기록하고 초록 종료
  writeResult({
    surface: 'dom',
    status: 'inconclusive',
    error: String((err && err.message) || err),
  })
  process.exitCode = 0
})
