import type { AxiosInstance } from 'axios'
import axios from 'axios'

export default class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      timeout: 1000 * 95,
      headers: { 'X-Custom-Header': 'foobar' },
    })
  }

  get<T = any>(url: string, params: any = {}): Promise<T> {
    return this.instance.get(url, { params }).then(response => response.data)
  }

  post<T = any>(url: string, data: any = {}): Promise<T> {
    return this.instance.post(url, data).then(response => response.data)
  }
}
