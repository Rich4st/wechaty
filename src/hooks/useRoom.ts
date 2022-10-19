import type { Contact, Room } from 'wechaty'
import { membersMsgTemplate } from '../utils/msg-template'
import { BOT_NAME } from '../constants/index'

export const useRoom = () => {
  const getAllMembers = async (room: Room) => {
    const members: Contact[] = await room.memberAll()
    const memberNames: string[] = members.filter((member: Contact) => member.name() !== BOT_NAME).map((member: Contact) => member.name())
    await room.say(membersMsgTemplate(memberNames))
  }

  return {
    getAllMembers,
  }
}
