import qrcode from 'qrcode-terminal'
import Whatsapp from 'whatsapp-web.js'
const { Client, LocalAuth } = Whatsapp

const client = new Client({
  authStrategy: new LocalAuth()
})

client.on('qr', qr => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', async () => {
  process.exit()
})

client.initialize()