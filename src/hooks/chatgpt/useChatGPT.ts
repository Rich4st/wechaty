import { ChatGPTAPI } from 'chatgpt'
import type { Message } from 'wechaty'
import { chatGPTToken } from '../../../config'

interface ChatGPTConfig {
  AutoReply: boolean
  MakeFriend: boolean
  ChatGPTSessionToken: string
}

const config: Partial<ChatGPTConfig> = {
  ChatGPTSessionToken: chatGPTToken,
}
async function getChatGPTReply(content) {
  const api = new ChatGPTAPI({ sessionToken: config.ChatGPTSessionToken })

  await api.ensureAuth()
  console.log('content: ', content)

  const response = await api.sendMessage(content)
  console.log('response: ', response)

  return response
}

async function replyMessage(contact, content) {
  const reply = await getChatGPTReply(content)
  try {
    await contact.say(reply)
  }
  catch (e) {
    console.error(e)
  }
}

export const useChatGPT = async (msg: Message, _fromRoom?: boolean) => {
  let talker = null

  if (!_fromRoom)
    talker = msg.talker()
  else
    talker = msg.room()

  const content = msg.text().slice(1)

  if (talker)
    await replyMessage(talker, content)
}
