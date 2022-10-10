import { WechatyBuilder } from 'wechaty'
import type { Message } from 'wechaty'
import type { WechatyInterface } from 'wechaty/impls'
import { onFriendship, onLogin, onLogout, onMessage, onScan } from './hooks/index'
import { useMission } from './hooks/mission/index'

const bot: WechatyInterface = WechatyBuilder.build({
  name: 'puppet-wechat',
  puppetOptions: {
    uos: true, // 开启uos协议
  },
  puppet: 'wechaty-puppet-wechat',
})

bot.on('scan', onScan)
  .on('login', onLogin)
  .on('logout', onLogout)
  .on('friendship', onFriendship)
  .on('message', async (msg: Message) => {
    if (msg.text().startsWith('/'))
      await onMessage(msg)
  })

/* start bot */
bot.start().then(async () => {
  console.log('✨ your bot started.')

  await useMission(bot)
})
