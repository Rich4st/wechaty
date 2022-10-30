import fse from 'fs-extra'
import type { ICustomService } from '../types'

const useFse = () => {
  const fseUpdate = (filePath: string, insertData: any) => {
    const oldData: string[] = fse.readJSONSync(filePath)

    const newData = oldData.filter((item: any) =>
      item.name !== insertData.name,
    )

    newData.push(insertData)

    fse.writeJSONSync(filePath, newData)
  }

  const fseExist = (filePath: string, data: string, isAdamin?: boolean): ICustomService => {
    if (isAdamin)
      return { name: 'Rich4$t', isCS: true }
    const dataList: ICustomService[] = fse.readJSONSync(filePath)

    const found = dataList.find((item: ICustomService) => item.name === data)

    if (found && found.isCS)
      return found
    return {}
  }

  const fseCurrent = async (filePath: string) => {
    const oldData: ICustomService[] = fse.readJSONSync(filePath)
    const found = oldData.find((item: ICustomService) => item.isCS)
    if (found)
      return found.name
    return 'Rich4$t'
  }

  return {
    fseUpdate,
    fseExist,
    fseCurrent,
  }
}

export {
  useFse,
}
