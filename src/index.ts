import dotenv from 'dotenv'
dotenv.config()

import { CronJob } from 'cron'
import { moveSundayService } from './moveSundayService.js'
import { photoCleaning } from './photoCleaning.js'
import './website.js'

new CronJob('0 15 * * *', moveSundayService, undefined, true)
new CronJob('0 15 * * *', photoCleaning, undefined, true)
