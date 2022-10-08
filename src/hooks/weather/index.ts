import type { Message } from 'wechaty'
import { getWeatherAPI } from '../../api/index'
import { API_KEY } from '../../constants/index'
import type { IWeather } from '../../types/index'

export const useWeather = async (msg: Message) => {
  try {
    const city = <string>msg.talker().city() ?? '厦门'
    const { newslist } = await getWeatherAPI({ key: API_KEY, city })
    const tomorrowWeather = <IWeather>newslist[1]
    const { date } = tomorrowWeather
    const weatherStr = `
    📅 ${date}
    🏙 ${city}
    🌤 ${tomorrowWeather.weather}
    🌡 ${tomorrowWeather.lowest}~${tomorrowWeather.highest}
    💨 ${tomorrowWeather.wind}
    💧 ${tomorrowWeather.humidity}
    🌧 ${tomorrowWeather.pcpn}
    🌞 ${tomorrowWeather.sunrise}~${tomorrowWeather.sunset}
    🌙 ${tomorrowWeather.moonrise}~${tomorrowWeather.moondown}
    📌 ${tomorrowWeather.tips}
    `
    return weatherStr
  }
  catch (err) {
    console.log('err', err)
  }
  return '无法获取您所在地区天气信息'
}
