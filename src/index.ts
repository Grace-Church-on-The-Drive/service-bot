import dotenv from 'dotenv'
dotenv.config()

import { CronJob } from 'cron'
import { moveSundayService } from './moveSundayService.js'

new CronJob('0 15 * * *', moveSundayService, undefined, true)
if (process.env.SCREENSHOT == 'true')
  import('./screenshot.js')
