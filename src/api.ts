import { IData } from '../types/types'

// https://www.carlrippon.com/fetch-with-async-await-and-typescript/
async function fetchAPI<T> (url: RequestInfo): Promise<T> {
  const response = await fetch(url)
  let body
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  try {
    body = await response.json()
  } catch (err) {
    if (typeof err === 'string') {
      console.log(`Something went wrong! ${err}`)
    } else {
      console.log('Something went wrong!')
    }
  }

  return body
}

const transformData: Function = (data: [], keyMap: IData) => {
  for (const [oldKey, newKey] of Object.entries(keyMap)) {
    data.forEach(item => {
      if (!item[oldKey]) return
      Object.assign(item, { [String(newKey)]: item[oldKey] })
      // delete item[oldKey] --> this cause lint error
    })
  }
  return data
}

export {
  fetchAPI,
  transformData
}
