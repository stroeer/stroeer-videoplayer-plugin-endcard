import EndcardPlugin from './plugin'
import { version } from '../package.json'
import logger from './logger'
import { IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

let endcardPlugin: EndcardPlugin

const onVideoElFirstQuartile = (): void => {
  endcardPlugin.render()
}

const onVideoElEnd = (): void => {
  endcardPlugin.addClickEvents()
  endcardPlugin.show()
  endcardPlugin.revolverplay()
}

const plugin = {
  pluginName: 'Endcard',
  init: (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) => {
    logger.log('opts', opts)

    const videoEl = stroeervideoplayer.getVideoEl()
    endcardPlugin = new EndcardPlugin(stroeervideoplayer, opts)

    videoEl.addEventListener('contentVideoFirstQuartile', onVideoElFirstQuartile)
    videoEl.addEventListener('contentVideoEnded', onVideoElEnd)
  },
  deinit: (stroeervideoplayer: IStroeerVideoplayer) => {
    const videoEl = stroeervideoplayer.getVideoEl()
    const endcardContainer = stroeervideoplayer.getRootEl().querySelector('.plugin-endcard-container')

    if (endcardContainer !== undefined) {
      videoEl.removeEventListener('contentVideoFirstQuartile', onVideoElFirstQuartile)
      videoEl.removeEventListener('contentVideoEnded', onVideoElEnd)
      endcardPlugin.reset()
      endcardContainer.remove()
    }
  },
  version: version
}

export default plugin
