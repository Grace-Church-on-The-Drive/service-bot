import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs/promises'
import compression from 'compression'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))
app.use(compression())

app.get('/api/images', async (_req, res) => {
  const eventPhotoDir = await fs.readdir('./web/pictures', { withFileTypes: true }).then((files) => files.filter(file => file.isDirectory()))
  const images: {
    [index: string]: string[]
  } = {}
  await Promise.all(eventPhotoDir.map(async dir => images[dir.name] = await fs.readdir(`./web/pictures/${dir.name}`)))
  res.json(images)
})

app.listen(port, () => console.log('website on ' + port))
