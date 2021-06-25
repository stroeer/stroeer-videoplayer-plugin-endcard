import noop from './noop'
import logger from './logger'
import { fetchAPI, transformData } from './api'
import { getTile, getTileReplay } from './template'
import { IData, IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import { ticker } from './revolverplay'

class EndcardPlugin {
  videoplayer: IStroeerVideoplayer
  videoElement: HTMLVideoElement
  isDesktop: boolean
  endcardContainer: HTMLDivElement
  onLoadedCallback: Function
  onClickToPlayCallback: Function
  onClickToReplayCallback: Function
  onRevolverplayCallback: Function
  onRevolverplayPauseCallback: Function
  dataKeyMap: object
  transformedData: IData[]
  showEndcard: boolean
  uiEl: HTMLDivElement
  revolverplayTime: number
  intervalTicker: NodeJS.Timeout | null

  constructor (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) {
    this.videoplayer = stroeervideoplayer
    this.videoElement = stroeervideoplayer.getVideoEl()

    this.dataKeyMap = opts.dataKeyMap !== undefined ? opts.dataKeyMap : noop
    this.transformedData = []
    this.showEndcard = opts.showEndcard !== undefined ? opts.showEndcard : true
    this.revolverplayTime = opts.revolverplayTime !== undefined ? opts.revolverplayTime : 5
    this.intervalTicker = null
    // TODO: isDesktop can be removed if UI plugin bug is fixed
    this.isDesktop = window.screen.width > 768

    this.onLoadedCallback = opts.onLoadedCallback !== undefined ? opts.onLoadedCallback : noop
    this.onClickToPlayCallback = opts.onClickToPlayCallback !== undefined ? opts.onClickToPlayCallback : noop
    this.onClickToReplayCallback = opts.onClickToReplayCallback !== undefined ? opts.onClickToReplayCallback : noop
    this.onRevolverplayCallback = opts.onRevolverplayCallback !== undefined ? opts.onRevolverplayCallback : noop
    this.onRevolverplayPauseCallback = opts.onRevolverplayPauseCallback !== undefined ? opts.onRevolverplayPauseCallback : noop

    this.uiEl = stroeervideoplayer.getUIEl()

    this.endcardContainer = document.createElement('div')
    this.endcardContainer.classList.add('plugin-endcard-container', 'hidden')
    this.videoElement.after(this.endcardContainer)

    return this
  }

  getEndcardUrl = (): string => {
    const url = this.videoElement.dataset.endcardUrl
    return url !== undefined ? url : ''
  }

  setEndcardUrl = (url: string): void => {
    this.videoElement.dataset.endcardUrl = url
  }

  render = (): void => {
    const endpoint = this.getEndcardUrl()
    if (endpoint === null || !this.showEndcard) {
      this.showEndcard = false
      this.renderFallback()
      return
    }

    fetchAPI<object>(endpoint)
      .then((data) => {
        this.transformedData = transformData(data, this.dataKeyMap)
        logger.log(this.transformedData)

        for (let i: number = 0; i < 5; i++) {
          const tileTemplate = getTile(i, this.transformedData[i], this.revolverplayTime)
          const replayTemplate = getTileReplay(this.videoplayer.getPosterImage())
          if (i === 3) {
            this.endcardContainer.innerHTML += replayTemplate
          }
          this.endcardContainer.innerHTML += tileTemplate
        }
      })
      .catch(err => {
        logger.log('Something went wrong with fetching api!', err)
        this.showEndcard = false
        this.renderFallback()
      })
  }

  reset = (): void => {
    this.clearRevolverplay()
    this.removeClickEvents()
    this.endcardContainer.innerHTML = ''
    this.hide()
  }

  revolverplay = (): void => {
    if (this.revolverplayTime === 0 || !this.showEndcard) return

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const progressSvgCircle = this.endcardContainer.querySelector('[data-role="plugin-endcard-progress-value"]')! as HTMLElement
    let remainingTime = this.revolverplayTime
    const revolverplayTicker = (): void => {
      ticker(this.revolverplayTime, remainingTime, progressSvgCircle, () => {
        this.play(0, true)
        this.onRevolverplayCallback()
      })
      remainingTime--
    }

    revolverplayTicker()
    this.intervalTicker = setInterval(revolverplayTicker, 1000)
  }

  clearRevolverplay = (): void => {
    if (this.intervalTicker !== null) {
      clearInterval(this.intervalTicker)
    }
  }

  replay = (): void => {
    this.videoplayer.play()
    this.reset()
  }

  play = (idx: number, autoplay: boolean): void => {
    this.clearRevolverplay()
    this.setEndcardUrl(this.transformedData[idx].endpoint)
    this.videoplayer.replaceAndPlay(this.transformedData[idx], autoplay)
    this.reset()
  }

  clickToPlay = (e: Event): void => {
    e.preventDefault()

    const el = (e.target as Element).closest('[data-role="plugin-endcard-tile"]')
    const idx: string | null = el !== null ? el.getAttribute('data-idx') : null
    if (idx === null) return
    this.play(parseInt(idx), false)
    this.onClickToPlayCallback()
  }

  clickToReplay = (e: Event): void => {
    e.preventDefault()
    e.stopPropagation()
    this.replay()
    this.onClickToReplayCallback()
  }

  clickToPause = (e: Event): void => {
    e.preventDefault()
    e.stopPropagation()
    this.onRevolverplayPauseCallback()
    this.clearRevolverplay()
  }

  addClickEvents = (): void => {
    const tiles = this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-tile"]')
    const pauseButton = this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]')
    const replayTile = this.endcardContainer.querySelector('[data-role="plugin-endcard-tile-replay"]')

    tiles.forEach(tile => {
      tile.addEventListener('click', this.clickToPlay)
    })

    if (replayTile !== null) {
      replayTile.addEventListener('click', this.clickToReplay)
    }

    if (pauseButton !== null) {
      pauseButton.addEventListener('click', this.clickToPause)
    }
  }

  removeClickEvents = (): void => {
    const tiles = this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-tile"]')
    const pauseButton = this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]')
    const replayTile = this.endcardContainer.querySelector('[data-role="plugin-endcard-tile-replay"]')

    tiles.forEach(tile => {
      tile.removeEventListener('click', this.clickToPlay)
    })

    if (replayTile !== null) {
      replayTile.removeEventListener('click', this.clickToReplay)
    }

    if (pauseButton !== null) {
      pauseButton.removeEventListener('click', this.clickToPause)
    }
  }

  renderFallback = (): void => {
    const replayTemplate = getTileReplay(this.videoplayer.getVideoEl().getAttribute('poster'), 'plugin-endcard-tile-single')
    this.endcardContainer.innerHTML += replayTemplate
  }

  hide = (): void => {
    // TODO: UI switch should be done in UI plugin, here because to show endcard features
    // so isDesktop can be removed if UI plugin bug is fixed
    if (this.isDesktop || this.uiEl.classList.contains('hidden')) {
      this.uiEl.classList.remove('hidden')
    }
    this.endcardContainer.classList.add('hidden')
  }

  show = (): void => {
    // TODO: UI switch should be done in UI plugin, here because to show endcard features
    // so isDesktop can be removed if UI plugin bug is fixed
    if (this.isDesktop || !this.showEndcard) {
      this.uiEl.classList.add('hidden')
    }
    this.endcardContainer.classList.remove('hidden')
    this.onLoadedCallback()
  }
}

export default EndcardPlugin
