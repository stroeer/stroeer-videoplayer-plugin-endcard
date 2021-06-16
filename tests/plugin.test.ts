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

	play = jest.fn()
	load = jest.fn()
	setSrc = jest.fn()
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

test('play should call correct functions', () => {
  plugin.clearRevolverplay = jest.fn()
  plugin.hide = jest.fn()

  plugin.play(0)
  expect(plugin.clearRevolverplay).toHaveBeenCalledTimes(1)
  expect(svp.setSrc).toHaveBeenCalledTimes(1)
  expect(svp.load).toHaveBeenCalledTimes(1)
  expect(svp.play).toHaveBeenCalledTimes(1)
  expect(plugin.hide).toHaveBeenCalledTimes(1)
})

test('replay should call correct functions', () => {
  plugin.clearRevolverplay = jest.fn()
  plugin.hide = jest.fn()
  
	plugin.replay()
	expect(plugin.clearRevolverplay).toHaveBeenCalledTimes(1)
  expect(svp.play).toHaveBeenCalledTimes(1)
  expect(plugin.hide).toHaveBeenCalledTimes(1)
})

test('revolverplay should call correct functions', () => {
  plugin.revolverplay()
  expect(mockTicker).toHaveBeenCalledTimes(1)
  mockTicker.mockRestore()
})

test('click events should call correct functions', () => {
  const tiles = document.querySelectorAll('[data-role="plugin-endcard-tile"]') as NodeListOf<HTMLElement>
	const replayTile = document.querySelector('[data-role="plugin-endcard-tile-replay"]') as HTMLElement
  const pauseButton = document.querySelector('[data-role="plugin-endcard-pause"]') as HTMLButtonElement
	plugin.replay = jest.fn()
  plugin.play = jest.fn()
  plugin.clearRevolverplay = jest.fn()
  plugin.onClickCallback = jest.fn()
  plugin.onRevolverplayPauseCallback = jest.fn()
  plugin.addClickEvents()
  tiles.forEach(tile => {
    tile.click()
  })
	replayTile.click()
  pauseButton.click()
	
	expect(plugin.replay).toHaveBeenCalledTimes(1)
  expect(plugin.play).toHaveBeenCalledTimes(1)
  expect(plugin.onClickCallback).toHaveBeenCalledTimes(1)
  expect(plugin.clearRevolverplay).toHaveBeenCalledTimes(1)
  expect(plugin.onRevolverplayPauseCallback).toHaveBeenCalledTimes(1)
})

test('hide should hide endcard and show UI controlbar', () => {
  plugin.hide()
  expect(plugin.endcardContainer.classList).toContain('hidden')
  expect(plugin.uiEl.classList).not.toContain('hidden')
})

test('show should show endcard, hide UI controlbar and call callback', () => {
  plugin.onLoadedCallback = jest.fn()
  plugin.showEndcard = false
  plugin.show()
  expect(plugin.endcardContainer.classList).not.toContain('hidden')
  expect(plugin.uiEl.classList).toContain('hidden')
  expect(plugin.onLoadedCallback).toHaveBeenCalledTimes(1)
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
    plugin.showEndcard = false
    plugin.render()
    expect(plugin.renderFallback).toHaveBeenCalledTimes(1)
  })
  
  test('render should fill endcardContainer with HTML', async () => {   
    plugin.showEndcard = true
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
    plugin.showEndcard = true  
    plugin.render()
    await flushPromises()
    expect(plugin.renderFallback).toHaveBeenCalledTimes(1)
  })
})