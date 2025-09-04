import fs from 'fs-extra'
import path from 'path'

const deploy = async () => {
  const currentDir = process.cwd()

  const { execa } = await import('execa')

  await execa('tsc', { cwd: currentDir })

  const distDir = path.join(currentDir, 'dist')

  await fs.copy(
    path.join(currentDir, 'package.json'),
    path.join(distDir, 'package.json')
  )
  await fs.copy(
    path.join(currentDir, 'package-lock.json'),
    path.join(distDir, 'package-lock.json')
  )

  await execa('npm', ['publish', '--access', 'public'], {
    cwd: distDir,
    stdio: 'inherit',
  })

  await fs.remove(distDir)
}

deploy()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
