import { resolve } from 'path'
import type { Message, Wechaty } from 'wechaty'
import { ADMIN_NAME, BOT_INTRODUCTION } from '../constants'
import type { ICustomService } from '../types'
import { useFse } from '../utils'
import { useCurriculum, useCustomService, useMission, useRoom, useWeather } from './index'

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
    const { setScheduleJob, getScheDuleJob } = useMission()
    const { getCurriculum } = useCurriculum()
    const { getAllMembers } = useRoom()
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

      /* get all members */
      case '/members':
        await getAllMembers(room)
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
    const csConfigDir = resolve(__dirname, './config/config.json')

    // if (this.msg.text().startsWith('/exit')) {
    //   fse.writeJSONSync(csConfigDir, { name: this.msg.talker().name(), isCS: false })
    //   this.msg.say('🌟 退出人工服务')
    // }

    // const isCs = await fse.readJsonSync(csConfigDir)

    // if (isCs.isCS) {
    //   if (this.msg.talker().name() === ADMIN_NAME)
    //     (await this.bot.Contact.find({ name: isCs.name })).say(this.msg.text())
    //   else
    //     (await this.bot.Contact.find({ name: ADMIN_NAME })).say(this.msg.text())
    //   return
    // }
    const { fseExist, fseCurrent } = useFse()
    const contact: Message = this.msg
    const { enterCustomService, exitCustomService } = useCustomService(this.msg, this.bot)

    /* 退出人工客服模式 */
    if (contact.text().startsWith('/exit'))
      await exitCustomService()

    /* 进入人工客服 */
    let currentContact: ICustomService | null = null
    if (contact.talker().name() !== ADMIN_NAME)
      currentContact = await fseExist(csConfigDir, contact.talker().name())
    else
      currentContact = await fseExist(csConfigDir, contact.talker().name(), true)

    if ((Object.keys(currentContact).length !== 0 && currentContact.isCS)) {
      if (contact.talker().name() !== ADMIN_NAME) {
        const ADMIN = this.bot.Contact.find({ name: ADMIN_NAME })
        await (await ADMIN).say(`来自${contact.talker().name()}: ${contact.text()}`)
        return
      }
      else {
        const CUSTOMER = await fseCurrent(csConfigDir)
        await (await this.bot.Contact.find({ name: CUSTOMER })).say(contact.text())
        return
      }
    }

    const command: string = this.msg.text()
    const { getCurriculum } = useCurriculum()
    const { setScheduleJob, getScheDuleJob } = useMission()

    switch (command) {
      case '/r':
        await enterCustomService()
        break

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
