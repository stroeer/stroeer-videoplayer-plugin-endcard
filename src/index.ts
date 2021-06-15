import EndcardPlugin from './plugin'
import { version } from '../package.json'
import logger from './logger'
import { IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

const plugin = {
  pluginName: 'Endcard',
  init: (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) => {
    logger.log('opts', opts)

    const endcardPlugin = new EndcardPlugin(stroeervideoplayer, opts)
    const videoEl = stroeervideoplayer.getVideoEl()

    videoEl.addEventListener('contentVideoFirstQuartile', () => {
      endcardPlugin.render()
    })

    videoEl.addEventListener('contentVideoEnded', () => {
      endcardPlugin.addClickEvents()
      endcardPlugin.show()
      endcardPlugin.revolverplay()
    })
  },
  deinit: () => {
  },
  version: version
}

export default plugin
