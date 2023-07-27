import http from 'node:http'
import puppeteer from 'puppeteer'
import venom from 'venom-bot'

const client = await venom
  .create({
    session: 'service-bot', //name of session
    headless: 'new',
    disableSpins: true
  })

process.on('SIGINT', function () {
  client.close()
  browser.close()
})

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})
const page = await browser.newPage()
await page.setViewport({ width: 1920, height: 1080 })

const server = http.createServer(async (req, res) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.HTTP_AUTHORIZATION) {
    res.writeHead(501).end()
    return
  }


  await page.goto(process.env.RUNDOWN_SHEET!)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await page.screenshot({
    path: './screenshots/rundown.jpg', clip: {
      x: 45,
      y: 165,
      width: 801,
      height: 379,
    }
  })

  await page.goto(process.env.AUDIO_SHEET!)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await page.screenshot({
    path: './screenshots/audio_sheet.jpg', clip: {
      x: 45,
      y: 165,
      width: 1566,
      height: 438,
    }
  })

  await client
    .sendImage(
      process.env.CHAT_ID!,
      './screenshots/rundown.jpg',
      'rundown',
      'Auto send rundown'
    )
  await client
    .sendImage(
      process.env.CHAT_ID!,
      './screenshots/audio_sheet.jpg',
      'audio sheet',
      'Auto send audio sheet'
    )

  res.writeHead(200).end()
})

server.listen(3000)
