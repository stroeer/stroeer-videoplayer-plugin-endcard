import { IData } from '../types/types'
import logger from './logger'

// https://www.carlrippon.com/fetch-with-async-await-and-typescript/
async function fetchAPI<T> (request: RequestInfo): Promise<T> {
  const response = await fetch(request)
  let body

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  try {
    body = await response.json()
  } catch (err) {
    logger.log('Something went wrong with fetching api!', err)
  }

  return body
}

const transformData: Function = (data: [], keyMap: IData) => {
  for (const [oldKey, newKey] of Object.entries(keyMap)) {
    data.forEach(item => {
      if (!item[oldKey]) return
      item[newKey] = item[oldKey]
    })
  }
  return data
}

export {
  fetchAPI,
  transformData
}
