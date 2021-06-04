import EndcardPlugin from '../src/plugin'

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

test('replay should call correct functions', function() {
  const plugin = new EndcardPlugin(svp)
  plugin.clearRevolverplay = jest.fn()
  plugin.hide = jest.fn()
  
	plugin.replay()
	expect(plugin.clearRevolverplay).toHaveBeenCalledTimes(1)
  expect(svp.play).toHaveBeenCalledTimes(1)
  expect(plugin.hide).toHaveBeenCalledTimes(1)
})