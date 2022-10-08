import type { WechatyInterface } from 'wechaty/impls'
import mission from './mission.json'

interface IMission {
  date: string
  content: string
  name: string
}

const mis = mission as IMission[]

export const useMission = async (bot: WechatyInterface) => {
  // 循环mis创建定时任务
  mis.forEach((item: IMission) => {
    const { date, content, name } = item
    const hour = date.split(':')[0]
    const minute = date.split(':')[1]
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('node-schedule').scheduleJob(`00 ${minute} ${hour} * * *`, async () => {
      bot.Contact.find({ name }).then((contact) => {
        contact?.say(content)
      })
    })
  })
}
