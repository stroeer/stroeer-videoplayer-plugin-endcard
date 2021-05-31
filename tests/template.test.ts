import { getTile, getTileReplay } from '../src/template'

const dataObj = [
  {
    title: 'Title of tile number one',
    image: 'https://videos.giga.de/files/1307753225/480p.jpg',
    sources: [],
    endpoint: '',
  },
  {
    title: 'Title of tile number two',
    image: 'https://videos.giga.de/files/1307753225/720p.jpg',
    sources: [],
    endpoint: '',
  },
  {
    title: 'Title of tile number three',
    image: 'https://videos.giga.de/files/1307753225/1080p.jpg',
    sources: [],
    endpoint: '',
  }
]

test('Tile markup is rendered as expected when revolverplay is active', () => {
  document.body.innerHTML = '<div id="testContainer"></div>'
  const stage = document.querySelector('#testContainer')!
  for (let i = 0; i < dataObj.length; i++) {
    stage.innerHTML += getTile(i, dataObj[i], 2)
  }
  expect(stage).toMatchSnapshot()
})

test('Tile markup is rendered as expected when revolverplay is not active', () => {
  document.body.innerHTML = '<div id="testContainer"></div>'
  const stage = document.querySelector('#testContainer')!
  for (let i = 0; i < dataObj.length; i++) {
    stage.innerHTML += getTile(i, dataObj[i], 0)
  }
  expect(stage).toMatchSnapshot()
})

test('Replay tile markup is rendered as expected', () => {
  document.body.innerHTML = '<div id="testContainer"></div>'
  const stage = document.querySelector('#testContainer')!
  stage.innerHTML = getTileReplay('https://videos.giga.de/files/1307753225/720p.jpg')
  expect(stage).toMatchSnapshot()
})