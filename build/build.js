const fs = require('fs/promises')
const path = require('path')

const browser = process.argv[2]

const outputDir = path.resolve(__dirname, `../dist/${browser}`)
const srcDir = path.resolve(__dirname, '../src')

const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true })
  let entries = await fs.readdir(src, { withFileTypes: true })

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name)
    let destPath = path.join(dest, entry.name)

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath)
  }
}

const updateManifest = async () => {
  const version = require('../package.json').version

  let manifest = JSON.parse(
    await fs.readFile(
      path.resolve(__dirname, `../manifest/${browser}.json`),
      'utf-8',
    ),
  )

  console.log(manifest.version, '==>', version)

  manifest.version = version

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
