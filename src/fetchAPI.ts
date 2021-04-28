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
    console.log(`Something went wrong! ${err}`)
  }

  return body
}

export default fetchAPI