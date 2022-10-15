/**
 * bot hooks
 */

import { ScanStatus, log } from 'wechaty'
import { FriendshipImpl } from 'wechaty/impls'
import QrTerminal from 'qrcode-terminal'

export interface IBot {
  onScan: (qrcode: any, status: ScanStatus) => void
  onLogin: (user: any) => void
  onLogout: (user: any, reason: any) => void
  onFriendship: (friendship: FriendshipImpl) => Promise<void>
}

const useBot = () => {
  /* on scan */
  const onScan = async (qrcode: any, status: ScanStatus) => {
    if (status === ScanStatus.Waiting && qrcode) {
      const QrCode = ['https://wechaty.js.org/qrcode/', encodeURIComponent(qrcode)].join('')

      log.info(`onScan: ${ScanStatus[status]}(${status}) - ${QrCode}`)

      QrTerminal.generate(qrcode, { small: true }) // show qrcode on console
    }
    else {
      log.info(`onScan: ${ScanStatus[status]}(${status})`)
    }
  }

  /* on login */
  const onLogin = async (user: any) => {
    log.info(`${user} login`)
  }

  /* on logout */
  const onLogout = async (user: any, reason: any) => {
    log.info(`${user} logout, reason: ${reason}`)
  }

  /* on friendship */
  const onFriendship = async (friendship: FriendshipImpl) => {
    switch (friendship.type()) {
      case FriendshipImpl.Type.Receive:
        await friendship.accept()
        break
      case FriendshipImpl.Type.Confirm:
        break
    }
  }
  return {
    onScan,
    onLogin,
    onLogout,
    onFriendship,
  }
}

export {
  useBot,
}

