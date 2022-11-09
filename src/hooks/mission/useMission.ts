import { resolve } from 'path'
import schedule from 'node-schedule'
import { nanoid } from 'nanoid'
import type { Contact, Message, Room, Wechaty } from 'wechaty'
import fse from 'fs-extra'
import type { IScheduleJob } from '../../types/index'
import { dateSplit, msgTemplate, scheduleJobsTemplate } from '../../utils/index'

const useMission = () => {
  const setScheduleJob = async (msg: Message, bot?: Wechaty) => {
    await msg.say(msgTemplate(msg.talker().name(), '您的定时消息设置成功!🥳'))
    const id = nanoid()
    const room = msg.room()// msg from room
    const payload = msg.text().split('-') // split command
    const timer = dateSplit(payload[1]) // get timer
    const content = payload[2] // job content
    const toContact = payload[3] // msg to who?
    const name = msg.talker().name() // msg from who?

    /* write into file */
    await fse.readJSON(resolve(__dirname, './ScheduleJob.json')).then(async (ScheduleJobs: IScheduleJob[]) => {
      const roomTopic = await room?.topic() || ''
      const newJob: IScheduleJob = {
        id,
        date: `${timer[0]}:${timer[1]}`,
        dayOfWeek: timer[2],
        name,
        content,
        room: roomTopic,
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
      schedule.scheduleJob(id, `${timer[2] ?? 0} ${timer[1]} ${timer[0]} * * *`, async () => {
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

  const removeScheduleJob = async (msg: Message) => {
    const payload = msg.text().split('-')
    const deleteId = payload[1].toLowerCase()
    const oldData = fse.readJSONSync(resolve(__dirname, './ScheduleJob.json')) as IScheduleJob[]

    const newData = oldData.filter((el: IScheduleJob) => {
      if (el.id.startsWith(deleteId)) {
        schedule.scheduledJobs[el.id]?.cancel()
        return el
      }
      return null
    })

    fse.writeJSONSync(resolve(__dirname, './ScheduleJob.json'), newData)

    await msg.say(msgTemplate(msg.talker().name(), `您的定时消息${deleteId}已删除!🥳`))
  }

  const getScheDuleJob = async (msg: Message) => {
    await fse.readJSON(resolve(__dirname, './ScheduleJob.json')).then(async (scheduleJobs: IScheduleJob[]) => {
      const name = msg.talker().name()
      const myJob = scheduleJobs.filter((job: IScheduleJob) => job.name === name)
      if (myJob.length === 0) {
        await msg.say(msgTemplate(name, '您还没有设置定时消息哦~'))
        return
      }
      await msg.say(scheduleJobsTemplate(myJob))
    })
  }

  return {
    setScheduleJob,
    excuteScheduleJob,
    getScheDuleJob,
    removeScheduleJob,
  }
}

export {
  useMission,
}
