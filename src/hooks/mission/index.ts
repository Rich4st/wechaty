import type { WechatyInterface } from 'wechaty/impls'
import schedule from 'node-schedule'
import type { Contact, Message } from 'wechaty'
import mission from './mission.json'

interface IMission {
  date: string
  content: string
  name?: string
  room?: string
}

const mis = mission as IMission[]

export const useMission = async (bot: WechatyInterface) => {
  // 循环mis创建定时任务
  mis.forEach((item: IMission) => {
    const { date, content, name } = item
    const hour = date.split(':')[0]
    const minute = date.split(':')[1]
    if (name) {
      schedule.scheduleJob(`00 ${minute} ${hour} * * *`, async () => {
        bot.Contact.find({ name }).then((contact) => {
          contact?.say(content)
        })
      })
    }
    else {
      schedule.scheduleJob(`00 ${minute} ${hour} * * *`, async () => {
        bot.Room.find({ topic: item.room }).then((room) => {
          room?.say(`@Rich4$t,${content}`)
        })
      })
    }
  })
}

export const useMissionByCustom = async (bot: WechatyInterface, msg: Message) => {
  await msg.say(`${msg.talker().name()},您的定时消息设置成功!🥳`)
  const room = msg.room()
  const payload = msg.text().split('-')
  const timer = payload[1].split(':')
  const content = payload[2]
  const toContact = payload[3]
  const name = msg.talker().name()

  if (room) {
    schedule.scheduleJob(`00 ${timer[1]} ${timer[0]} * * *`, async () => {
      if (toContact)
        await room.say(`@${toContact}, ${content}`)
      else
        await room.say(`@${name}, ${content}`)
    })
  }
  else {
    schedule.scheduleJob(`00 ${timer[1]} ${timer[0]} * * *`, async () => {
      if (toContact) {
        bot.Contact.find({ name: toContact }).then((contact: Contact) => {
          contact.say(content)
        })
      }
      else {
        bot.Contact.find({ name }).then((contact: Contact) => {
          contact.say(content)
        })
      }
    })
  }
}
