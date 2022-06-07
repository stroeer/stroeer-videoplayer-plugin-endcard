import EndcardPlugin from './plugin'
import { version } from '../package.json'
import logger from './logger'
import { IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

let endcardPlugin: EndcardPlugin

const onVideoElPlay = (e: Event): void => {
  endcardPlugin.reset()
  if (e.target !== null) e.target.removeEventListener('play', onVideoElPlay)
}

const onVideoElFirstQuartile = (): void => {
  endcardPlugin.render()
}

const onVideoElEnd = (e: Event): void => {
  if (e.target !== null) e.target.addEventListener('play', onVideoElPlay)
  endcardPlugin.addClickEvents()
  endcardPlugin.show()
}

const plugin = {
  pluginName: 'Endcard',
  init: (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) => {
    logger.log('opts', opts)

    const videoEl = stroeervideoplayer.getVideoEl()
    endcardPlugin = new EndcardPlugin(stroeervideoplayer, opts)

    videoEl.addEventListener('contentVideoSecondOctile', onVideoElFirstQuartile)
    videoEl.addEventListener('contentVideoEnded', onVideoElEnd)
  },
  deinit: (stroeervideoplayer: IStroeerVideoplayer) => {
    const videoEl = stroeervideoplayer.getVideoEl()
    const endcardContainer = stroeervideoplayer.getRootEl().querySelector('.plugin-endcard-container')

    if (endcardContainer !== undefined) {
      videoEl.removeEventListener('contentVideoSecondOctile', onVideoElFirstQuartile)
      videoEl.removeEventListener('contentVideoEnded', onVideoElEnd)
      endcardPlugin.reset()
      endcardContainer.remove()
    }
  },
  version: version
}

export { plugin as StroeerVideoplayerEndcardPlugin }
