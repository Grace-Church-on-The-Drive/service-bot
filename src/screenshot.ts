import http from 'node:http'
import puppeteer from 'puppeteer'

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
  console.log('Screenshot has been captured successfully')
})

server.listen(3000)