import type { ICurriculum, IScheduleJob } from '../types'
import { AVATAR_LIST } from '../constants'

export const msgTemplate = (to: string, msg: string) => {
  return `👋 @${to}\n${msg}`
}

export const scheduleJobsTemplate = (scheduleJobs: IScheduleJob[]) => {
  return scheduleJobs.map((scheduleJob: IScheduleJob) => {
    const { id, date, content, name, to, room, dayOfWeek } = scheduleJob
    const dayOfWeekStr = dayOfWeek ? `每周${['日', '一', '二', '三', '四', '五', '六', '日'][dayOfWeek]}` : ' 每天'
    const dateStr = dayOfWeek ? `📅时间: ${dayOfWeekStr} ${date}` : `📅时间:${dayOfWeekStr}${date}`
    const toStr = to ? `👥发送给: ${to}` : ''
    if (room)
      return `id:${id}\n${dateStr}\n📝内容: ${content}\n👤昵称: ${name}\n🏠群聊: ${room}\n${toStr}`

    return `id:${id}\n${dateStr}\n📝内容: ${content}\n👤昵称: ${name}\n${toStr}`
  }).join('\n- - - - - - - - - - - - - - - - - -\n')
}

export const curriculumTemplate = (to: string, curriculum: ICurriculum[], week: string, isTomorrow: boolean) => {
  const tomorrow = isTomorrow ? '明天' : '今天'
  const curriculumStr = curriculum.map((item: ICurriculum) => {
    const { subject, time } = item
    return `📚${subject}\n⏰${time}`
  }).join('\n- - - - - - - - - - - - - - - - - -\n')
  return `👋 ${to}, ${tomorrow}星期${week}, 课表如下： \n${curriculumStr}`
}

export const allCurriculumTemplate = (to: string, curriculum: ICurriculum[]) => {
  const curriculumStr = curriculum.map((item: ICurriculum) => {
    const { subject, time, id } = item
    return `星期${['日', '一', '二', '三', '四', '五', '六'][id]}: \n📚${subject}\n⏰${time}`
  }).join('\n- - - - - - - - - - - - - - - - - -\n')
  return `👋 ${to}, 课表如下： \n${curriculumStr}`
}

export const membersMsgTemplate = (members: string[]) => {
  return members.map((member: string) => {
    // 随机获取AVATAR_LIST中的一个
    const avatar = AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)]
    return `${avatar} ${member}`
  }).join('\n')
}
