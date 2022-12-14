import type { ICurriculum, IScheduleJob } from '../types'
import { AVATAR_LIST } from '../constants'

export const msgTemplate = (to: string, msg: string) => {
  return `ð @${to}\n${msg}`
}

export const scheduleJobsTemplate = (scheduleJobs: IScheduleJob[]) => {
  return scheduleJobs.map((scheduleJob: IScheduleJob) => {
    const { id, date, content, name, to, room, dayOfWeek } = scheduleJob
    const dayOfWeekStr = dayOfWeek ? `æ¯å¨${['æ¥', 'ä¸', 'äº', 'ä¸', 'å', 'äº', 'å­', 'æ¥'][dayOfWeek]}` : ' æ¯å¤©'
    const dateStr = dayOfWeek ? `ðæ¶é´: ${dayOfWeekStr} ${date}` : `ðæ¶é´:${dayOfWeekStr}${date}`
    const toStr = to ? `ð¥åéç»: ${to}` : ''
    if (room)
      return `id:${id}\n${dateStr}\nðåå®¹: ${content}\nð¤æµç§°: ${name}\nð ç¾¤è: ${room}\n${toStr}`

    return `id:${id}\n${dateStr}\nðåå®¹: ${content}\nð¤æµç§°: ${name}\n${toStr}`
  }).join('\n- - - - - - - - - - - - - - - - - -\n')
}

export const curriculumTemplate = (to: string, curriculum: ICurriculum[], week: string, isTomorrow: boolean) => {
  const tomorrow = isTomorrow ? 'æå¤©' : 'ä»å¤©'
  const curriculumStr = curriculum.map((item: ICurriculum) => {
    const { subject, time } = item
    return `ð${subject}\nâ°${time}`
  }).join('\n- - - - - - - - - - - - - - - - - -\n')
  return `ð ${to}, ${tomorrow}ææ${week}, è¯¾è¡¨å¦ä¸ï¼ \n${curriculumStr}`
}

export const allCurriculumTemplate = (to: string, curriculum: ICurriculum[]) => {
  const curriculumStr = curriculum.map((item: ICurriculum) => {
    const { subject, time, id } = item
    return `ææ${['æ¥', 'ä¸', 'äº', 'ä¸', 'å', 'äº', 'å­'][id]}: \nð${subject}\nâ°${time}`
  }).join('\n- - - - - - - - - - - - - - - - - -\n')
  return `ð ${to}, è¯¾è¡¨å¦ä¸ï¼ \n${curriculumStr}`
}

export const membersMsgTemplate = (members: string[]) => {
  return members.map((member: string) => {
    // éæºè·åAVATAR_LISTä¸­çä¸ä¸ª
    const avatar = AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)]
    return `${avatar} ${member}`
  }).join('\n')
}
