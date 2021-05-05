import { version } from '../package.json'
import noop from './noop'
import logger from './logger'
import { fetchAPI, transformData } from './api'
import getCardTemplate from './template'
import { IStroeerVideoplayer, IEndcardOptions } from '../types/types'

class EndcardPlugin {
  videoplayer: IStroeerVideoplayer
  videoElement: HTMLVideoElement
  videoElementWidth: number
  videoElementHeight: number
  endcardContainer: HTMLDivElement
  endcardUri: string | null
  OnLoadedCallback: Function
  OnClickCallback: Function
  OnRevolverplayCallback: Function
  OnRevolverplayPauseCallback: Function
  dataKeyMap: object
  showEndcard: boolean

  constructor (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) {
    this.videoplayer = stroeervideoplayer
    // https://github.com/stroeer/stroeer-videoplayer/blob/main/src/StroeerVideoplayer.ts
    this.videoElement = stroeervideoplayer.getVideoEl()
    this.videoElementWidth = this.videoElement.clientWidth
    this.videoElementHeight = this.videoElement.clientHeight

    // TODO: maybe add get and set for endcard-url in videoplayer
    this.endcardUri = this.videoElement.getAttribute('data-endcard-url')
    this.dataKeyMap = opts.dataKeyMap !== undefined ? opts.dataKeyMap : noop
    this.showEndcard = true

    this.OnLoadedCallback = opts.OnLoadedCallback !== undefined ? opts.OnLoadedCallback : noop
    this.OnClickCallback = opts.OnClickCallback !== undefined ? opts.OnClickCallback : noop
    this.OnRevolverplayCallback = opts.OnRevolverplayCallback !== undefined ? opts.OnRevolverplayCallback : noop
    this.OnRevolverplayPauseCallback = opts.OnRevolverplayPauseCallback !== undefined ? opts.OnRevolverplayPauseCallback : noop

    this.endcardContainer = document.createElement('div')
    this.endcardContainer.classList.add('plugin-endcard-container', 'hidden')

    // this.videoElement.after(this.endcardContainer)
    const uiEl = stroeervideoplayer.getUIEl()
    uiEl.appendChild(this.endcardContainer)

    return this
  }

  addClickEvents = (): void => {
    const cards = this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-card"]')
    const pauseButton = this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]')

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault()
        this.OnClickCallback(this.videoElement)
      })
    })

    if (pauseButton === null) return
    pauseButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.OnRevolverplayPauseCallback(this.videoElement)
    })
  }

  render = (): void => {
    if (this.endcardUri === null) return

    fetchAPI<object>(
      this.endcardUri)
      .then((data) => {
        const transformedData = transformData(data, this.dataKeyMap)
        logger.log(transformedData)

        for (let i: number = 0; i < 6; i++) {
          const cardTemplate = getCardTemplate(i, transformedData[i])
          this.endcardContainer.innerHTML += cardTemplate
        }
      })
      .catch(err => {
        logger.log('Something went wrong with fetching api!', err)
        this.showEndcard = false
      })
  }

  show = (): void => {
    if (!this.showEndcard) return
    this.videoplayer.deinitUI(this.videoplayer.getUIName())
    this.endcardContainer.classList.remove('hidden')
    this.OnLoadedCallback(this.videoElement)
  }
}

const plugin = {
  pluginName: 'Endcard',
  init: function (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) {
    logger.log('opts', opts)

    const endcardPlugin = new EndcardPlugin(stroeervideoplayer, opts)
    const videoEl = stroeervideoplayer.getVideoEl()

    // for development change "contentVideoFirstQuartile" to "loadedmetadata"
    videoEl.addEventListener('contentVideoFirstQuartile', () => {
      endcardPlugin.render()
      endcardPlugin.addClickEvents()
    })

    // for development change "contentVideoEnded" to "loadedmetadata"
    videoEl.addEventListener('contentVideoEnded', () => {
      endcardPlugin.show()
    })
  },
  deinit: function () {
  },
  version: version
}

export default plugin
