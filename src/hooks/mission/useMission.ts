import schedule from 'node-schedule'
import type { Contact, Message, Wechaty } from 'wechaty'

const useMission = () => {
  const setScheduleJob = async (msg: Message, bot?: Wechaty) => {
    await msg.say(`${msg.talker().name()},您的定时消息设置成功!🥳`)
    const room = msg.room() // msg from room
    const payload = msg.text().split('-') // split command
    const timer = payload[1].split(':') // get timer
    const content = payload[2] // job content
    const toContact = payload[3] // msg to who?
    const name = msg.talker().name() // msg from who?

    if (room) {
      schedule.scheduleJob(`${timer[2] ?? 0} ${timer[1]} ${timer[0]} * * *`, async () => {
        if (toContact)
          await room.say(`@${toContact}, ${content}`)
        else
          await room.say(`@${name}, ${content}`)
      })
    }
    else {
      schedule.scheduleJob(`${timer[2] ?? 0} ${timer[1]} ${timer[0]} * * *`, async () => {
        if (toContact) {
          bot.Contact.find({ name: toContact }).then(async (contact: Contact) => [
            await contact.say(content),
          ])
          return
        }
        await msg.say(content)
      })
    }
  }

  return {
    setScheduleJob,
  }
}

export {
  useMission,
}
