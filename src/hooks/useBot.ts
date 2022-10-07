/**
 * bot hooks
 */

import { ScanStatus, log } from 'wechaty'

/* on scan */
export const onScan = (qrcode: any, status: ScanStatus) => {
  if (status === ScanStatus.Waiting && qrcode) {
    const QrCode = ['https://wechaty.js.org/qrcode/', encodeURIComponent(qrcode)].join('')

    log.info(`onScan: ${ScanStatus[status]}(${status}) - ${QrCode}`)

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('qrcode-terminal').generate(qrcode, { small: true }) // show qrcode on console
  }
  else {
    log.info(`onScan: ${ScanStatus[status]}(${status})`)
  }
}

/* on login */
export const onLogin = (user: any) => {
  log.info(`${user} login`)
}

/* on logout */
export const onLogout = (user: any, reason: any) => {
  log.info(`${user} logout, reason: ${reason}`)
}