import type { Message } from 'wechaty'
import { WechatyBuilder } from 'wechaty'
import type { WechatyInterface } from 'wechaty/impls'
import { useBot, useMessage, useMission } from './hooks/index'
import { BOT_NAME } from './constants/index'

const bot: WechatyInterface = WechatyBuilder.build({
  name: 'puppet-wechat',
  puppetOptions: {
    uos: true,
  },
  puppet: 'wechaty-puppet-wechat',
})

const { onScan, onLogin, onLogout, onFriendship } = useBot()

bot.on('scan', onScan)
  .on('login', onLogin)
  .on('logout', onLogout)
  .on('friendship', onFriendship)
  .on('message', async (msg: Message) => {
    await useMessage(bot, msg)
  })

/* start bot */
bot.start().then(async () => {
  console.log(`✨ ${BOT_NAME} is online now.`)
  const { excuteScheduleJob } = useMission()
  await excuteScheduleJob(bot)
})
