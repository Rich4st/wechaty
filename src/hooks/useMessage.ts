import type { Message } from 'wechaty'
import { CommandFactory } from './useFactory'

export const onMessage = async (msg: Message) => {
  const room = msg.room()

  if (msg.self())
    return

  if (room) {
    await room.say(await new CommandFactory(msg.text(), msg).getData() as string)
  }
  else {
    const contact = msg.talker()
    await contact.say(await new CommandFactory(msg.text(), msg).getData() as string)
  }
}
