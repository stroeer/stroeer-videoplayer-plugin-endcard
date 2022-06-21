import EndcardPlugin from './plugin'
import { version } from '../package.json'
import logger from './logger'
import { noop } from './noop'
import { IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

class Plugin {
  public static version: string = version
  public static pluginName: string = 'Endcard'
  onVideoElPlay: Function
  onVideoElFirstQuartile: Function
  onVideoElEnd: Function

  constructor () {
    this.onVideoElPlay = noop
    this.onVideoElFirstQuartile = noop
    this.onVideoElEnd = noop

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}): void => {
    logger.log('opts', opts)
    logger.log('version', Plugin.version)

    
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

export { Plugin as StroeerVideoplayerEndcardPlugin }
