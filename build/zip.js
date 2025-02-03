import fs from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import pkg from '../package.json' with { type: 'json' }
import archiver from 'archiver'
const __dirname = dirname(fileURLToPath(import.meta.url))

const browser = process.argv[2]

const entryDir = resolve(__dirname, `../dist/${browser}`)
const outputDir = resolve(
  __dirname,
  `../[${browser}] yt-caption-checker-${pkg.version}.zip`,
)
const hasDir = fs.existsSync(entryDir)

if (hasDir) {
  console.log(`zip: "${entryDir}"`)
  try {
    const output = fs.createWriteStream(outputDir)
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })

    archive.on('error', console.error)

    output.on('close', () => {
      console.log(`output: "${outputDir}"`)
      console.log(archive.pointer() + ' total bytes')
    })

    archive.pipe(output)
    archive.directory(entryDir, false)
    archive.finalize()
  } catch (err) {
    console.error(err)
  }
}
