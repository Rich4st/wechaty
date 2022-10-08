import type { Message } from 'wechaty'
import { BOT_INTRODUCTION } from '../constants'
import { useWeather } from './weather/index'

/**
 * @description: 天气预报
 * @param {Message} msg
 * @param {string} command
 * @return {*}
 * @Date: 2021-08-31 16:38:00
 */
export class CommandFactory {
  private command: string
  private msg: Message

  constructor(command: string, msg: Message) {
    this.command = command
    this.msg = msg
  }

  async getData() {
    switch (this.command) {
      /* 天气预报 */
      case '/weather':
      case '/w':
        return await useWeather(this.msg)

      case (/^\/w.*:/g.test(this.command) ? this.command : ''):
        return await useWeather(this.msg, true)

      /* 机器人介绍 */
      case '/start':
      case '/s':
      case '/help':
        return BOT_INTRODUCTION
      default:
        return 'command not found'
    }
  }
}
