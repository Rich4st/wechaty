import type { Message } from 'wechaty'
import { getWeatherAPI } from '../../api/index'
import { API_KEY } from '../../constants/index'
import type { IWeather } from '../../types/index'

export const useWeather = async (msg: Message, isSearch = false) => {
  try {
    let city = <string>msg.talker().city() ?? 'ε¦ι¨'
    if (isSearch)
      city = msg.text().split(':')[1]
    const { newslist } = await getWeatherAPI({ key: API_KEY, city })
    const tomorrowWeather = <IWeather>newslist[1]
    const { date } = tomorrowWeather
    const weatherStr = `
    π€:
    π ${date}
    π ${city}
    π€ ${tomorrowWeather.weather}
    π‘ ${tomorrowWeather.lowest}~${tomorrowWeather.highest}
    π¨ ${tomorrowWeather.wind}
    π§ ${tomorrowWeather.humidity}
    π§ ${tomorrowWeather.pcpn}
    π ${tomorrowWeather.sunrise}~${tomorrowWeather.sunset}
    π ${tomorrowWeather.moonrise}~${tomorrowWeather.moondown}
    π ${tomorrowWeather.tips}
    `
    return weatherStr
  }
  catch (err) {
    console.log('err', err)
  }
  return 'ζ ζ³θ·εζ¨ζε¨ε°εΊε€©ζ°δΏ‘ζ―'
}
