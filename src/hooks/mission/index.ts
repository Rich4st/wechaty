import type { WechatyInterface } from 'wechaty/impls'
import schedule from 'node-schedule'
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
