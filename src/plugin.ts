import noop from './noop'
import logger from './logger'
import { fetchAPI, transformData } from './api'
import { getTile, getTileReplay } from './template'
import { IData, IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import { ticker } from './revolverplay'

class EndcardPlugin {
  videoplayer: IStroeerVideoplayer
  videoElement: HTMLVideoElement
  endcardContainer: HTMLDivElement
  onLoadedCallback: Function
  onClickToPlayCallback: Function
  onClickToReplayCallback: Function
  onRevolverplayCallback: Function
  onRevolverplayPauseCallback: Function
  dataKeyMap: object
  transformedData: IData[]
  showFallback: boolean
  uiEl: HTMLDivElement
  revolverplayTime: number
  intervalTicker: NodeJS.Timeout | null

  constructor (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) {
    this.videoplayer = stroeervideoplayer
    this.videoElement = stroeervideoplayer.getVideoEl()

    this.dataKeyMap = opts.dataKeyMap !== undefined ? opts.dataKeyMap : noop
    this.transformedData = []
    this.showFallback = opts.showFallback !== undefined ? opts.showFallback : false
    this.revolverplayTime = opts.revolverplayTime !== undefined ? opts.revolverplayTime : 5
    this.intervalTicker = null

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

  reset = (): void => {
    this.clearRevolverplayTimer()
    this.removeClickEvents()
    this.endcardContainer.innerHTML = ''
    this.hide()
  }

  revolverplay = (): void => {
    if (this.revolverplayTime === 0 || this.showFallback) return

    /* eslint-disable-next-line */
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

  clearRevolverplayTimer = (): void => {
    if (this.intervalTicker !== null) {
      clearInterval(this.intervalTicker)
    }
  }

  replay = (): void => {
    this.videoplayer.play()
  }

  play = (idx: number, autoplay: boolean): void => {
    this.setEndcardUrl(this.transformedData[idx].endpoint)
    this.videoplayer.replaceAndPlay(this.transformedData[idx], autoplay)
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
    const circles = this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-revolverplay-icon"] circle')
    const target = e.currentTarget as HTMLElement

    e.preventDefault()
    e.stopPropagation()
    this.onRevolverplayPauseCallback()
    this.clearRevolverplayTimer()

    if (target !== null) {
      target.remove()
    }
    circles.forEach((circle) => {
      circle.remove()
    })
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
    const replayTemplate = getTileReplay(this.videoplayer.getPosterImage(), 'plugin-endcard-tile-single')
    this.endcardContainer.innerHTML += replayTemplate
  }

  render = (): void => {
    const endpoint = this.getEndcardUrl()
    if (endpoint === null || this.showFallback) {
      this.showFallback = true
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
        this.showFallback = true
        this.renderFallback()
      })
  }

  hide = (): void => {
    if (this.uiEl.classList.contains('plugin-endcard-ui-small')) {
      this.uiEl.classList.remove('plugin-endcard-ui-small')
    }
    this.endcardContainer.classList.add('hidden')
  }

  show = (): void => {
    this.uiEl.classList.add('plugin-endcard-ui-small')

    if (typeof this.videoplayer.exitFullscreen === 'function') {
      this.videoplayer.exitFullscreen()
    }
    this.endcardContainer.classList.remove('hidden')
    this.onLoadedCallback()
  }
}

export default EndcardPlugin
