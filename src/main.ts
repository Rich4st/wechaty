import { WechatyBuilder } from 'wechaty'
import { onLogin, onLogout, onScan } from './hooks/index'

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

/* start bot */
bot.start().then(() => {
  console.log('✨ you bot started.')
})
