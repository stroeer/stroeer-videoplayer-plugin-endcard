import { getTile, getTileReplay } from '../src/template'
import testData from './data.json'

test('Tile markup is rendered as expected when revolverplay is active', () => {
  document.body.innerHTML = '<div id="testContainer"></div>'
  const stage = document.querySelector('#testContainer')!
  for (let i = 0; i < testData.length; i++) {
    stage.innerHTML += getTile(i, testData[i], 2)
  }
  expect(stage).toMatchSnapshot()
})

test('Tile markup is rendered as expected when revolverplay is not active', () => {
  document.body.innerHTML = '<div id="testContainer"></div>'
  const stage = document.querySelector('#testContainer')!
  for (let i = 0; i < testData.length; i++) {
    stage.innerHTML += getTile(i, testData[i], 0) 
  }
  expect(stage).toMatchSnapshot()
})

test('Replay tile markup is rendered as expected', () => {
  document.body.innerHTML = '<div id="testContainer"></div>'
  const stage = document.querySelector('#testContainer')!
  stage.innerHTML = getTileReplay('https://videos.giga.de/files/1307753225/720p.jpg')
  expect(stage).toMatchSnapshot()
})