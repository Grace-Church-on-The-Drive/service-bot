import dotenv from 'dotenv'
dotenv.config()

import { CronJob } from 'cron'
import { moveSundayService } from './moveSundayService.js'

new CronJob('0 0 15 * *', moveSundayService, undefined, true)
import './screenshot.js'
