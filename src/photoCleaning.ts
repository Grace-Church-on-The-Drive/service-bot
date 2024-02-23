import fs from 'node:fs/promises'

export const photoCleaning = async () => {
  const eventPhotoDir = await fs.readdir('./WORSHIP/Event photo', { withFileTypes: true }).then((files) => files.filter(file => file.isDirectory()))
  eventPhotoDir.forEach(dir => {
    if (dir.name.includes('(avteam)'))
      fs.rename(`./WORSHIP/Event photo/${dir.name}`, `./WORSHIP/Event photo/${dir.name.slice(0, -9)}`)
  })
}

