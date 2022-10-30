import { resolve } from 'path'
import type { Message, Wechaty } from 'wechaty'
import { useFse } from '../utils'
import type { ICustomService } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useCustomService = (msg: Message, bot?: Wechaty) => {
  const { fseUpdate } = useFse()
  const csConfigDir = resolve(__dirname, './config/config.json')

  const exitCustomService = async () => {
    const insertData: ICustomService = {
      name: msg.talker().name(),
      isCS: false,
    }
    fseUpdate(csConfigDir, insertData)

    await msg.say('Lil J talking to you now')
  }

  const enterCustomService = async () => {
    const changeData: ICustomService = {
      name: msg.talker().name(),
      isCS: true,
    }
    fseUpdate(csConfigDir, changeData)

    await msg.say('Rich4$t talking to you now')
  }

  return {
    exitCustomService,
    enterCustomService,
  }
}

export {
  useCustomService,
}
