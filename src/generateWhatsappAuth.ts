import venom from 'venom-bot'

const client = await venom
  .create({
    session: 'service-bot', //name of session
    headless: 'new',
    disableSpins: true
  })

client.close()