import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import pack from '../package.json' with { type: 'json' }

const browser = process.argv[2]

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const outputDir = path.resolve(__dirname, `../dist/${browser}`)
const srcDir = path.resolve(__dirname, '../src')

const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true })
  let entries = await fs.readdir(src, { withFileTypes: true })

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name)
    let destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
      continue
    }

    if (!entry.name.endsWith('.test.js')) {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

const updateManifest = async () => {
  let manifest = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, `../manifest/${browser}.json`),
      'utf-8',
    ),
  )

  console.log(manifest.version, '==>', pack.version)

  manifest.version = pack.version

  await fs.writeFile(
    path.resolve(__dirname, `../manifest/${browser}.json`),
    JSON.stringify(manifest, ' ', 2),
    'utf-8',
  )
}

const build = async () => {
  await updateManifest()

  await fs.rm(outputDir, { recursive: true, force: true })
  await copyDir(srcDir, outputDir)
  await fs.copyFile(
    path.resolve(__dirname, `../manifest/${browser}.json`),
    path.resolve(outputDir, './manifest.json'),
  )
}

build()
