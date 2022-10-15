import type { Message, Wechaty } from 'wechaty'
import { CommandFactory } from './useCommand'

const useMessage = (bot: Wechaty, msg: Message) => {
  const room = msg.room()

  if (msg.self())
    return

  if (room)
    new CommandFactory(msg).excuteRoom()
  else
    new CommandFactory(msg, bot).excuteContact()
}

export {
  useMessage,
}
