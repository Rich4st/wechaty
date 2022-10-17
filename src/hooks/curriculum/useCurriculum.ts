import { resolve } from 'path'
import type { Message } from 'wechaty'
import fse from 'fs-extra'
import type { ICurriculum } from '../../types'
import { allCurriculumTemplate, curriculumTemplate } from '../../utils/msg-template'

export const useCurriculum = () => {
  const getCurriculum = async (msg: Message) => {
    await fse.readJson(resolve(__dirname, './curriculum.json')).then(async (data: ICurriculum[]) => {
      const day = new Date().getDay()
      const week = ['日', '一', '二', '三', '四', '五', '六']
      if (msg.text() === '/tod') {
        const todayCurriculum = data.filter((item: ICurriculum) => item.id === day)
        if (todayCurriculum.length === 0)
          await msg.say('周末没有课啦🥳')
        else
          await msg.say(curriculumTemplate(msg.talker().name(), todayCurriculum, week[day], false))
      }
      else if (msg.text() === '/tall') {
        await msg.say(allCurriculumTemplate(msg.talker().name(), data))
      }
      else {
        const tomorrowCurriculum = data.filter((item: ICurriculum) => item.id === day + 1)
        if (tomorrowCurriculum.length === 0)
          await msg.say('周末没有课啦🥳')
        else
          await msg.say(curriculumTemplate(msg.talker().name(), tomorrowCurriculum, week[day + 1], true))
      }
    })
  }

  return {
    getCurriculum,
  }
}
