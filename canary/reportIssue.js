import { readFileSync } from 'fs'
import { execFileSync } from 'child_process'
import pkg from '../package.json' with { type: 'json' }
import { decideIssueAction } from './lib/issuePolicy.js'

const surface = (() => {
  const i = process.argv.indexOf('--surface')
  return i >= 0 ? process.argv[i + 1] : null
})()
if (!surface) {
  console.error('usage: node canary/reportIssue.js --surface <caption|dom>')
  process.exit(2)
}

const gh = args => execFileSync('gh', args, { encoding: 'utf-8' })
const ghQuiet = args => {
  try {
    execFileSync('gh', args, { stdio: 'ignore' })
  } catch {
    /* label may already exist */
  }
}

const marker = `[yt-canary:${surface}]`
const versionLabel = `v${pkg.version}`

// 결과 파일에서 상태 읽기 (없으면 inconclusive로 간주)
let status = 'inconclusive'
try {
  status = JSON.parse(readFileSync(`${surface}-canary-result.json`, 'utf-8')).status
} catch {
  console.log(`no result file for ${surface}; treating as inconclusive`)
}

// 열린 카나리아 이슈 목록 (bug 라벨 + 제목 마커로 판단)
const openIssues = JSON.parse(gh(['issue', 'list', '--state', 'open', '--label', 'bug', '--json', 'number,title']))
  .filter(i => i.title.includes(marker))

const decision = decideIssueAction({ status, openIssues })
console.log(JSON.stringify({ surface, status, openIssues, decision }))

if (decision.action === 'create') {
  ghQuiet(['label', 'create', 'bug', '--color', 'd73a4a', '--description', 'bug'])
  ghQuiet(['label', 'create', versionLabel, '--color', '0e8a16', '--description', 'affected version'])
  const title = `${marker} ${surface} canary detected a YouTube breakage`
  const body =
    `The **${surface}** canary failed. YouTube likely changed something the extension depends on.\n\n` +
    `- Version: \`${versionLabel}\`\n` +
    (surface === 'dom'
      ? `- ⚠️ DOM canary failures can be false alarms (bot wall / consent / A-B bucket). ` +
        `Confirm locally: \`npm run canary:dom\` in a real browser session.\n`
      : `- Reproduce locally: \`npm run canary:caption\`\n`) +
    `\nSee the failing GitHub Actions run for logs.`
  gh(['issue', 'create', '--title', title, '--body', body, '--label', 'bug', '--label', versionLabel])
  console.log('issue created')
} else if (decision.action === 'close') {
  gh(['issue', 'close', String(decision.number), '--comment', `${surface} canary is passing again — auto-closing.`])
  console.log(`issue #${decision.number} closed`)
} else {
  console.log('no issue action')
}
