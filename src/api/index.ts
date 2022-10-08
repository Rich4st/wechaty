import Requst from '../utils/request'

interface WeatherApiParam {
  key?: string
  city: string
}

const service = new Requst()

export const getWeatherAPI = (param: WeatherApiParam) => service.get('http://api.tianapi.com/tianqi/index', param)
