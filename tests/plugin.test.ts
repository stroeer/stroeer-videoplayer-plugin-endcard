import EndcardPlugin from '../src/plugin'
import * as revolverplay from '../src/revolverplay'
import testData from './data.json'

const videoEl = document.createElement('video')
videoEl.setAttribute('data-endcard-url', 'http://localhost:5000/')
const uiEl = document.createElement('div')
uiEl.classList.add('stroeer-videoplayer-ui')

class StroeerVideoplayer {
  constructor() {
    return this
  }

  getVideoEl = (): HTMLVideoElement => {
    return videoEl
  }

  getUIEl = (): HTMLElement => {
    return uiEl
  }

  getRootEl = jest.fn()
  play = jest.fn()
  load = jest.fn()
  replaceAndPlay = jest.fn()
  getPosterImage = jest.fn()
}

const svp = new StroeerVideoplayer()
const plugin = new EndcardPlugin(svp)

plugin.transformedData = testData

const createDom = () => {
  const tile1 = document.createElement('div')
  tile1.setAttribute('data-role', 'plugin-endcard-tile')
  tile1.setAttribute('data-idx', '2')
  const tile2 = document.createElement('div')
  tile2.setAttribute('data-role', 'plugin-endcard-tile')
  plugin.endcardContainer.appendChild(tile1)
  plugin.endcardContainer.appendChild(tile2)
  const replayTile = document.createElement('div')
  replayTile.setAttribute('data-role', 'plugin-endcard-tile-replay')
  plugin.endcardContainer.appendChild(replayTile)
  const button = document.createElement('button')
  button.setAttribute('data-role', 'plugin-endcard-pause')
  plugin.endcardContainer.appendChild(button)
  document.body.appendChild(plugin.endcardContainer)
}
createDom()

const mockTicker = jest
  .spyOn(revolverplay, 'ticker')
  .mockImplementation(() => '')
  
const mockClearRevolverplay = jest
  .spyOn(plugin, 'clearRevolverplayTimer')
  .mockImplementation(() => '')
  
const mockHide = jest
  .spyOn(plugin, 'hide')
  .mockImplementation(() => '')
  
const mockReplay = jest
  .spyOn(plugin, 'replay')
  .mockImplementation(() => '')

const mockPlay = jest
  .spyOn(plugin, 'play')
  .mockImplementation(() => '')
    
const mockRemoveClickEvents = jest
  .spyOn(plugin, 'removeClickEvents')
  .mockImplementation(() => '')
  
const mockSetEndcardUrl = jest
  .spyOn(plugin, 'setEndcardUrl')
  .mockImplementation(() => '')

test('clickToReplay should call correct functions', () => {
  plugin.onClickToReplayCallback = jest.fn()
  const target = document.querySelector('[data-role="plugin-endcard-tile-replay"]') as HTMLElement
  const e = new Event('click')
  Object.defineProperty(e, 'target', {value: target, enumerable: true});
  plugin.clickToReplay(e)
  expect(mockReplay).toHaveBeenCalledTimes(1)
  expect(plugin.onClickToReplayCallback).toHaveBeenCalledTimes(1)
})

test('clickToPause should call correct functions', () => {
  plugin.onRevolverplayPauseCallback = jest.fn()
  const target = document.querySelector('[data-role="plugin-endcard-pause"]') as HTMLButtonElement
  const e = new Event('click')
  Object.defineProperty(e, 'target', {value: target, enumerable: true});
  plugin.clickToPause(e)
  expect(mockClearRevolverplay).toHaveBeenCalledTimes(1)
  expect(plugin.onRevolverplayPauseCallback).toHaveBeenCalledTimes(1)
})

test('clickToPlay should call correct functions', () => {
  plugin.onClickToPlayCallback = jest.fn()
  const target = document.querySelector('[data-role="plugin-endcard-tile"]') as HTMLElement
  const e = new Event('click')
  Object.defineProperty(e, 'target', {value: target, enumerable: true});
  plugin.clickToPlay(e)
  expect(mockPlay).toHaveBeenCalledTimes(1)
  expect(plugin.onClickToPlayCallback).toHaveBeenCalledTimes(1)
})
  
test('play should call correct functions', () => {
  mockPlay.mockRestore() 
  plugin.play(0, true)
  expect(mockSetEndcardUrl).toHaveBeenCalledTimes(1)
  expect(svp.replaceAndPlay).toHaveBeenCalledTimes(1)
})

test('replay should call correct functions', () => {
  mockReplay.mockRestore()  
	plugin.replay()
  expect(svp.play).toHaveBeenCalledTimes(1)
})

test('revolverplay should call correct functions', () => {
  plugin.revolverplay()
  expect(mockTicker).toHaveBeenCalledTimes(1)
  mockTicker.mockRestore()
})

test('get and set endcard url work correctly', () => {
  mockSetEndcardUrl.mockRestore()
  plugin.setEndcardUrl('www.example.de')
  expect(plugin.getEndcardUrl()).toEqual('www.example.de')
})

test('click events should call correct functions', () => {
  const tiles = document.querySelectorAll('[data-role="plugin-endcard-tile"]') as NodeListOf<HTMLElement>
	const replayTile = document.querySelector('[data-role="plugin-endcard-tile-replay"]') as HTMLElement
  const pauseButton = document.querySelector('[data-role="plugin-endcard-pause"]') as HTMLButtonElement
  plugin.clickToPlay = jest.fn()
  plugin.clickToReplay = jest.fn()
  plugin.clickToPause = jest.fn()
  
  plugin.addClickEvents()
  tiles.forEach(tile => {
    tile.click()
  })
	replayTile.click()
  pauseButton.click()
	
	expect(plugin.clickToReplay).toHaveBeenCalledTimes(1)
  expect(plugin.clickToPlay).toHaveBeenCalledTimes(2)
  expect(plugin.clickToPause).toHaveBeenCalledTimes(1)
})

test('show should show endcard, hide UI controlbar and call callback', () => {
  plugin.onLoadedCallback = jest.fn()
  plugin.showFallback = true
  plugin.show()
  expect(plugin.endcardContainer.classList).not.toContain('hidden')
  expect(plugin.uiEl.classList).toContain('hidden')
  expect(plugin.onLoadedCallback).toHaveBeenCalledTimes(1)
})

test('reset should call correct functions', () => {
  plugin.reset()
  
  expect(mockRemoveClickEvents).toHaveBeenCalledTimes(1)
  expect(mockClearRevolverplay).toHaveBeenCalledTimes(1)
  expect(mockHide).toHaveBeenCalledTimes(1)
  expect(plugin.endcardContainer.innerHTML).toEqual('')
})

test('hide should hide endcard and show UI controlbar', () => {
  mockHide.mockRestore()
  plugin.hide()
  expect(plugin.endcardContainer.classList).toContain('hidden')
  expect(plugin.uiEl.classList).not.toContain('hidden')
})

// important for async functions --> waits until pending Promises are resolve
// https://stackoverflow.com/questions/44741102/how-to-make-jest-wait-for-all-asynchronous-code-to-finish-execution-before-expec
const flushPromises = () => new Promise(setImmediate) 

describe('testing render with working fetch API', () => {
  // Applies only to tests in this describe block
  beforeEach(function () {
    global.fetch = jest.fn().mockImplementation(async () => {
      const p = new Promise((resolve) => {
        resolve({
          ok: true,
          Id: '123',
          json: function () {
            return plugin.transformedData
          }
        })
      })

      return p
    })
  })

  test('render should call renderFallback in case default endcard should not be shown', async () => {    
    plugin.renderFallback = jest.fn()
    plugin.showFallback = true
    plugin.render()
    expect(plugin.renderFallback).toHaveBeenCalledTimes(1)
  })
  
  test('render should fill endcardContainer with HTML', async () => {   
    plugin.showFallback = false
    plugin.endcardContainer.innerHTML = ''
    plugin.render()
    await flushPromises()
    expect(plugin.endcardContainer.innerHTML).not.toEqual('')
  })
})

describe('testing render with failing fetch API', () => {
  // Applies only to tests in this describe block
  beforeEach(function () {
    global.fetch = jest.fn().mockImplementation(async () => Promise.reject("API is down"))
  })
  
  test('render should call renderFallback', async () => {
    // even showFallback is set to false, fallback is rendered because API fails
    plugin.showFallback = false
    plugin.render()
    await flushPromises()
    expect(plugin.renderFallback).toHaveBeenCalledTimes(1)
  })
})