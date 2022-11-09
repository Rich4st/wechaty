import type { Message, Wechaty } from 'wechaty'
import { BOT_INTRODUCTION } from '../constants'
import { useCurriculum, useMission, useRoom, useWeather } from './index'

export class CommandFactory {
  private bot: Wechaty
  private msg: Message

  constructor(msg: Message, bot?: Wechaty) {
    this.bot = bot
    this.msg = msg
  }

  /* excute Room command */
  async excuteRoom() {
    const room = this.msg.room()
    const { setScheduleJob, getScheDuleJob, removeScheduleJob } = useMission()
    const { getCurriculum } = useCurriculum()
    const { getAllMembers, qAllMembers } = useRoom()
    const command: string = this.msg.text()
    switch (command) {
      /* weather forest */
      case '/weather':
      case '/w':
        await room.say(await useWeather(this.msg))
        break

      /* weather search */
      case (/^\/w.*:/g.test(command) ? command : ''):
        await room.say(await useWeather(this.msg, true))
        break

      /* get my schedule job */
      case '/gm':
        await getScheDuleJob(this.msg)
        break

      case (/^\/d.*-/g.test(command) ? command : ''):
        removeScheduleJob(this.msg)
        break

      /* get all members */
      case '/members':
        await getAllMembers(room)
        break

      case '/all':
        await qAllMembers(room)
        break

      /* get curriculum */
      case '/tod':
      case '/tall':
      case '/tom':
        await getCurriculum(this.msg)
        break

      /* schedule job */
      case (/^\/m.*-/g.test(command) ? command : ''):
        await setScheduleJob(this.msg)
        break

      /* bot intro */
      case '/start':
      case '/s':
      case '/help':
        await room.say(BOT_INTRODUCTION)
        break
      default:
        return 'command not found'
    }
  }

  /* excute Contact command */
  async excuteContact() {
    const contact: Message = this.msg
    const command: string = this.msg.text()
    const { getCurriculum } = useCurriculum()
    const { setScheduleJob, getScheDuleJob, removeScheduleJob } = useMission()
    switch (command) {
      /* weather forest */
      case '/weather':
      case '/w':
        await contact.say(await useWeather(this.msg))
        break

      /* weather search */
      case (/^\/w.*:/g.test(command) ? command : ''):
        await contact.say(await useWeather(this.msg, true))
        break

      /* get my schedule job */
      case '/gm':
        await getScheDuleJob(this.msg)
        break

      case (/^\/d.*-/g.test(command) ? command : ''):
        removeScheduleJob(this.msg)
        break

      /* get curriculum */
      case '/tod':
      case '/tom':
        await getCurriculum(this.msg)
        break

      /* schedule job */
      case (/^\/m.*-/g.test(command) ? command : ''):
        await setScheduleJob(contact, this.bot)
        break

      /* bot intro */
      case '/start':
      case '/s':
      case '/help':
        await contact.say(BOT_INTRODUCTION)
        break
      default:
        return 'command not found'
    }
  }
}
