export const dateSplit = (date: string) => {
  const dateArr = date.split(':')
  const dateNum = dateArr.map((item) => {
    return parseInt(item)
  })
  return dateNum
}

