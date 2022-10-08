import { WechatyBuilder } from 'wechaty'
import type { Message } from 'wechaty'
import { onLogin, onLogout, onMessage, onScan } from './hooks/index'

const bot = WechatyBuilder.build({
  name: 'puppet-wechat',
  puppetOptions: {
    uos: true, // 开启uos协议
  },
  puppet: 'wechaty-puppet-wechat',
})

bot.on('scan', onScan)
  .on('login', onLogin)
  .on('logout', onLogout)
  .on('message', async (msg: Message) => {
    if (msg.text().startsWith('/'))
      await onMessage(msg)
  })

/* start bot */
bot.start().then(() => {
  console.log('✨ your bot started.')
})

