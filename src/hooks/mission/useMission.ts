import { resolve } from 'path'
import schedule from 'node-schedule'
import type { Contact, Message, Room, Wechaty } from 'wechaty'
import fse from 'fs-extra'
import type { IScheduleJob } from '../../types/index'
import { dateSplit, msgTemplate, scheduleJobsTemplate } from '../../utils/index'

const useMission = () => {
  const setScheduleJob = async (msg: Message, bot?: Wechaty) => {
    await msg.say(msgTemplate(msg.talker().name(), '您的定时消息设置成功!🥳'))
    const room = msg.room()// msg from room
    const payload = msg.text().split('-') // split command
    const timer = dateSplit(payload[1]) // get timer
    const content = payload[2] // job content
    const toContact = payload[3] // msg to who?
    const name = msg.talker().name() // msg from who?

    /* write into file */
    await fse.readJSON(resolve(__dirname, './ScheduleJob.json')).then(async (ScheduleJobs: IScheduleJob[]) => {
      const newJob: IScheduleJob = {
        date: `${timer[0]}:${timer[1]}`,
        dayOfWeek: timer[2],
        name,
        content,
        room: await room.topic() ?? undefined,
        to: toContact,
      }
      try {
        ScheduleJobs.push(newJob)
        await fse.writeJSON(resolve(__dirname, './ScheduleJob.json'), ScheduleJobs)
      }
      catch (err) {
        console.log('🚀 ~ file: useMission.ts ~ line 32 ~ await fse.readJSON ~ err', err)
      }
    })

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

  const excuteScheduleJob = async (bot?: Wechaty) => {
    await fse.readJSON(resolve(__dirname, './ScheduleJob.json')).then((scheduleJobs: IScheduleJob[]) => {
      !!scheduleJobs && scheduleJobs.forEach((scheduleJob: IScheduleJob) => {
        const { date, content, name, room } = scheduleJob
        const rule = new schedule.RecurrenceRule()
        rule.hour = dateSplit(date)[0]
        rule.minute = dateSplit(date)[1]
        schedule.scheduleJob(rule, async () => {
          if (room) {
            bot.Room.find({ topic: room }).then(async (room: Room) => {
              await room.say(msgTemplate(name, content))
            })
          }
          else {
            bot.Contact.find({ name }).then(async (contact: Contact) => {
              await contact.say(msgTemplate(name, content))
            })
          }
        })
      })
    })
  }

  const getScheDuleJob = async (msg: Message) => {
    await fse.readJSON(resolve(__dirname, './ScheduleJob.json')).then(async (scheduleJobs: IScheduleJob[]) => {
      const name = msg.talker().name()
      const myJob = scheduleJobs.filter((job: IScheduleJob) => job.name === name)
      await msg.say(scheduleJobsTemplate(myJob))
    })
  }

  return {
    setScheduleJob,
    excuteScheduleJob,
    getScheDuleJob,
  }
}

export {
  useMission,
}
