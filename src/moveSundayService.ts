import fs from 'node:fs/promises'

export const moveSundayService = async () => {
  const audioRecording = await fs.readdir('./WORSHIP/Recording/Audio')
  const videoRecording = await fs.readdir('./WORSHIP/Recording/Video')
  const powerpoint = await fs.readdir('./WORSHIP/Powerpoint/past')

  const isSunday = (dateString: string) => {
    const date = new Date()
    date.setFullYear(parseInt(`20${dateString.slice(0, 2)}`))
    date.setMonth(parseInt(dateString.slice(2, 4)) - 1)
    date.setDate(parseInt(dateString.slice(4, 6)))
    return date.getDay() === 0
  }

  audioRecording.map(async (file) => {
    const date = file.split('.')[0]
    if (!isSunday(date)) return
    await fs.mkdir(`./WORSHIP/Archive/${date}_Sunday Service/Recording`, { recursive: true })
    await fs.rename(`./WORSHIP/Recording/Audio/${file}`, `./WORSHIP/Archive/${date}_Sunday Service/Recording/${file}`)
  })

  videoRecording.map(async (file) => {
    const date = file.split(' ')[1].split('-').map((t) => t.length === 1 ? `0${t}` : t).join('').split('.')[0].slice(2)
    if (!(/^\d{6}$/gm.test(date))) return
    if (!isSunday(date)) return
    await fs.mkdir(`./WORSHIP/Archive/${date}_Sunday Service/Recording`, { recursive: true })
    fs.rename(`./WORSHIP/Recording/Video/${file}`, `./WORSHIP/Archive/${date}_Sunday Service/Recording/${file}`)
  })

  powerpoint.map(async (file) => {
    const date = file.split('_')[0]
    if (!(/^\d{6}$/gm.test(date))) return
    if (!isSunday(date)) return
    await fs.mkdir(`./WORSHIP/Archive/${date}_Sunday Service`, { recursive: true })
    await fs.rename(`./WORSHIP/Powerpoint/past/${file}`, `./WORSHIP/Archive/${date}_Sunday Service/${file}`)
  })
}
