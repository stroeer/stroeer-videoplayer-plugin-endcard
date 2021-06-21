import EndcardPlugin from './plugin'
import { version } from '../package.json'
import logger from './logger'
import { IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

let endcardPlugin: EndcardPlugin

const plugin = {
  pluginName: 'Endcard',
  init: (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) => {
    logger.log('opts', opts)

    const videoEl = stroeervideoplayer.getVideoEl()
    endcardPlugin = new EndcardPlugin(stroeervideoplayer, opts)

    videoEl.addEventListener('contentVideoFirstQuartile', endcardPlugin.onVideoElFirstQuartile)
    videoEl.addEventListener('contentVideoEnded', endcardPlugin.onVideoElEnd)
  },
  deinit: (stroeervideoplayer: IStroeerVideoplayer) => {
    const videoEl = stroeervideoplayer.getVideoEl()
    const endcardContainer = videoEl.getRootEl().querySelector('.plugin-endcard-container')

    if (endcardContainer !== undefined) {
      videoEl.removeEventListener('contentVideoFirstQuartile', endcardPlugin.onVideoElFirstQuartile)
      videoEl.removeEventListener('contentVideoEnded', endcardPlugin.onVideoElEnd)
      endcardContainer.remove()
    }
  },
  version: version
}

export default plugin
