import EndcardPlugin from '../src/plugin'
import * as revolverplay from '../src/revolverplay'

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
  plugin.transformedData = [
    {
        sources: [
          {
            quality: '1080',
            label: '1080p',
            src: 'https://dlc2.t-online.de/s/2021/05/07/20027894-1080p.mp4',
            type: 'video/mp4'
          },
          {
            quality: '720',
            label: '720p',
            src: 'https://dlc2.t-online.de/s/2021/05/07/20027894-720p.mp4',
            type: 'video/mp4'
          },
          {
            quality: '240',
            label: '240p',
            src: 'https://dlc2.t-online.de/s/2021/05/07/20027894-240p.mp4',
            type: 'video/mp4'
          }
        ],
        "endpoint": "http://localhost:5000/1",
        "title": "Bei voller Fahrt kommt plötzlich Panik auf",
        "image": "https://bilder.t-online.de/b/90/00/67/78/id_90006778/300/tid_da/index.jpg"
      }
  ]
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