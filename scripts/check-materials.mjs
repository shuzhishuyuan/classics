import fs from 'node:fs'
import path from 'node:path'

const materialsDir = path.resolve('public/materials')
const errors = []
let videoCount = 0

function checkDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      checkDirectory(filename)
      continue
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.mp4')) continue

    videoCount += 1
    const header = Buffer.alloc(256)
    const fd = fs.openSync(filename, 'r')
    let bytesRead
    try {
      bytesRead = fs.readSync(fd, header, 0, header.length, 0)
    } finally {
      fs.closeSync(fd)
    }

    const relativePath = path.relative(process.cwd(), filename)
    if (header.toString('utf8', 0, bytesRead).startsWith('version https://git-lfs.github.com/spec/v1')) {
      errors.push(`${relativePath}: Git LFS pointer found instead of video data.`)
    } else if (bytesRead < 12 || header.toString('ascii', 4, 8) !== 'ftyp') {
      errors.push(`${relativePath}: invalid MP4 header.`)
    }
  }
}

try {
  checkDirectory(materialsDir)
  if (videoCount === 0) errors.push('No material videos found in public/materials.')
} catch (error) {
  errors.push(error.message)
}

if (errors.length > 0) {
  console.error('Material video validation failed:\n' + errors.join('\n'))
  console.error('Download the real videos with: git lfs install --local && git lfs pull origin master')
  process.exitCode = 1
} else {
  console.log(`Material video headers verified: ${videoCount} files.`)
}
