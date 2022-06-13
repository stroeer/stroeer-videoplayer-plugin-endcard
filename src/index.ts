import EndcardPlugin from './plugin'
import { version } from '../package.json'
import logger from './logger'
import { noop } from './noop'
import { IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

class Plugin {
  version: string
  pluginName: string
  onVideoElPlay: Function
  onVideoElFirstQuartile: Function
  onVideoElEnd: Function

  constructor () {
    this.version = version
    this.pluginName = 'Endcard'
    this.onVideoElPlay = noop
    this.onVideoElFirstQuartile = noop
    this.onVideoElEnd = noop

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts?: any): void => {
    opts = opts ?? {}

    logger.log('opts', opts)
    logger.log('version', this.version)

    
    const videoEl = StroeerVideoplayer.getVideoEl()
    const endcardPlugin = new EndcardPlugin(StroeerVideoplayer, opts)

    this.onVideoElPlay = (): void => {
      endcardPlugin.reset()
      videoEl.removeEventListener('play', this.onVideoElPlay)
    }
    
    this.onVideoElFirstQuartile = (): void => {
      endcardPlugin.render()
    }
    
    this.onVideoElEnd = (e: Event): void => {
      videoEl.addEventListener('play', this.onVideoElPlay)
      endcardPlugin.show()
    }

    videoEl.addEventListener('contentVideoSecondOctile', this.onVideoElFirstQuartile)
    videoEl.addEventListener('contentVideoEnded', this.onVideoElEnd)
  }

  deinit = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoEl = StroeerVideoplayer.getVideoEl()
    videoEl.removeEventListener('contentVideoSecondOctile', this.onVideoElFirstQuartile)
    videoEl.removeEventListener('contentVideoEnded', this.onVideoElEnd)
    
    const endcardContainer = StroeerVideoplayer.getRootEl().querySelector('.plugin-endcard-container')
    if (endcardContainer !== undefined) {
      endcardContainer.remove()
    }
  }
}

const pluginWrap = {
  version: version,
  pluginName: 'Endcard',
  init: (StroeerVideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) => {
    const plugin = new Plugin()
    plugin.init(StroeerVideoplayer, opts)
  },
  deinit: (StroeerVideoplayer: IStroeerVideoplayer) => {
    // plugin.deinit(StroeerVideoplayer)
  }
}

export { pluginWrap as StroeerVideoplayerEndcardPlugin }
