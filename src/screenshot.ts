import http from 'node:http'
import puppeteer from 'puppeteer'
import Whatsapp from 'whatsapp-web.js'
const { Client, LocalAuth, MessageMedia } = Whatsapp

const server = http.createServer(async (req, res) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.HTTP_AUTHORIZATION) {
    res.writeHead(501).end()
    return
  }

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  // Set the viewport's width and height
  await page.setViewport({ width: 1920, height: 1080 })

  // Open ScrapingBee's home page
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

  await browser.close()

  const client = new Client({
    authStrategy: new LocalAuth()
  })

  client.on('ready', async () => {
    await client.sendMessage(process.env.CHAT_ID!, MessageMedia.fromFilePath('./screenshots/rundown.jpg'), { caption: 'Auto send rundown' })
    await client.sendMessage(process.env.CHAT_ID!, MessageMedia.fromFilePath('./screenshots/audio_sheet.jpg'), { caption: 'Auto send audio sheet' })
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await client.destroy()
    res.writeHead(200).end()
  })

  client.initialize()
})

server.listen(3000)