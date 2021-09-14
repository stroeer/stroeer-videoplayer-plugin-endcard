import { fetchAPI, transformData } from '../src/api'

let setOk = true
const data = [
  {
    endpoint: 'https://videos.giga.de/embed/862772935',
    title: 'Die 9 besten Filmtwists und Mindfuck-Filme',
    duration: 596,
    score: 0,
    producer: 'SELF',
    prod_date: null
  },
  {
    endpoint: 'https://videos.giga.de/embed/1344483288',
    title: '11 Spiele, die vom Index geflogen sind',
    duration: 563,
    score: 0,
    producer: 'SELF',
    prod_date: null
  }
]

beforeEach(function () {
  global.fetch = jest.fn().mockImplementation(async () => {
    const p = new Promise((resolve) => {
      resolve({
        ok: setOk,
        Id: '123',
        json: function () {
          return data
        }
      })
    })

    return p
  })
})

test('data should be transformed', () => {
  const keyMap = {
    time: 'duration',
    test2: 'test',
    text: 'title'
  }
  const expectedData = [
    {
      endpoint: 'https://videos.giga.de/embed/862772935',
      title: 'Die 9 besten Filmtwists und Mindfuck-Filme',
      text: 'Die 9 besten Filmtwists und Mindfuck-Filme',
      duration: 596,
      time: 596,
      score: 0,
      producer: 'SELF',
      prod_date: null
    },
    {
      endpoint: 'https://videos.giga.de/embed/1344483288',
      title: '11 Spiele, die vom Index geflogen sind',
      text: '11 Spiele, die vom Index geflogen sind',
      duration: 563,
      time: 563,
      score: 0,
      producer: 'SELF',
      prod_date: null
    }
  ]
  const transformedData = transformData(data, keyMap)
  expect(transformedData).toStrictEqual(expectedData)
})

test('api fetch should work', async () => {
  const response = await fetchAPI('https://videos.giga.de/suggestions/1363284707')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch).toHaveBeenCalledWith(
    'https://videos.giga.de/suggestions/1363284707'
  )
  expect(typeof response).toBe('object')
})

test('api fetch should throw error', async () => {
  setOk = false
  try {
    await fetchAPI('https://videos.giga.de/suggestions/1363284707')
  } catch (e) {
    expect(e.message).toEqual('HTTP error! status: undefined')
  }
})