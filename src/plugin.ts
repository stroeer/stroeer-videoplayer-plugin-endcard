import { version } from '../package.json'
import noop from './noop'
import Logger from './Logger'

interface IStroeerVideoplayer {
  getUIEl: Function
  getRootEl: Function
  getVideoEl: Function
  getUIName: Function
  initUI: Function
  deinitUI: Function
}

class EndcardPlugin {
  videoplayer: IStroeerVideoplayer
  onVideoElPlay: Function
  videoElement: HTMLVideoElement
  videoElementWidth: number
  videoElementHeight: number
  adsLoaded: boolean
  endcardContainer: HTMLDivElement

  constructor (stroeervideoplayer: IStroeerVideoplayer, endcardOpts?: any) {
    this.onVideoElPlay = noop
    this.videoplayer = stroeervideoplayer

    this.adsLoaded = false

    this.videoElement = stroeervideoplayer.getVideoEl()
    this.videoElementWidth = this.videoElement.clientWidth
    this.videoElementHeight = this.videoElement.clientHeight
    this.endcardContainer = document.createElement('div')
    this.endcardContainer.classList.add('endcard-container')

    this.endcardContainer.addEventListener('click', () => {
      console.log('endcard-container clicked')
    })

    const uiEl = stroeervideoplayer.getUIEl()

    uiEl.appendChild(this.endcardContainer)

    return this
  }

  run = (): void => {
    Logger.log(this.videoElement)
    window.addEventListener('resize', () => {
      Logger.log(this.videoElement.clientWidth, this.videoElement.clientHeight)
    })
    this.videoElement.addEventListener('contentVideoEnded', () => {
      Logger.log('Event contentVideoEnded fired for', this.videoplayer)
    })
  }
}

const plugin = {
  pluginName: 'Endcard',
  init: function (stroeervideoplayer: IStroeerVideoplayer, opts?: any) {
    opts = opts ?? {}
    Logger.log('opts', opts)
    const endcardPlugin = new EndcardPlugin(stroeervideoplayer)
    const videoEl = stroeervideoplayer.getVideoEl()
    videoEl.addEventListener('loadedmetadata', () => {
      endcardPlugin.run()
    })
  },
  deinit: function () {
  },
  version: version
}

export default plugin
