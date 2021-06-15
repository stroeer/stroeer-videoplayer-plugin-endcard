import EndcardPlugin from '../src/plugin'
import * as revolverplay from '../src/revolverplay'

const videoEl = document.createElement('video')
videoEl.setAttribute('data-endcard-url', 'http://localhost:5000/')

class StroeerVideoplayer {
	constructor() {
		return this
	}

	getVideoEl = (): HTMLVideoElement => {
		return videoEl
	}

	getUIEl = jest.fn()
	play = jest.fn()
	load = jest.fn()
	setSrc = jest.fn()
}

const svp = new StroeerVideoplayer()
const plugin = new EndcardPlugin(svp)

// create DOM
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

const mockTicker = jest
  .spyOn(revolverplay, 'ticker')
  .mockImplementation(() => '')

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
  const tiles: NodeListOf<HTMLElement> = document.querySelectorAll('[data-role="plugin-endcard-tile"]')
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