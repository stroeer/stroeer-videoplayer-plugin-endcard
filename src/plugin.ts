import { IData, IEndcardOptions, IStroeerVideoplayer } from '../types/types'
import { fetchAPI, transformData } from './api'
import logger from './logger'
import { noop, noopData } from './noop'
import { ticker } from './revolverplay'
import { getTile, getTileReplay } from './template'

class EndcardPlugin {
  videoplayer: IStroeerVideoplayer
  videoElement: HTMLVideoElement
  endcardContainer: HTMLDivElement
  onLoadedCallback: Function
  onClickToPlayCallback: Function
  onClickToReplayCallback: Function
  onRevolverplayCallback: Function
  onRevolverplayPauseCallback: Function
  onPlayCallback: (data: IData) => void
  dataKeyMap: object
  transformedData: IData[]
  showFallback: boolean
  isVideoFinished: boolean
  uiEl: HTMLDivElement
  revolverplayTime: number
  intervalTicker: NodeJS.Timeout | null
  transformApiData: (data: IData[]) => IData[]

  constructor(
    stroeervideoplayer: IStroeerVideoplayer,
    opts: IEndcardOptions = {}
  ) {
    this.videoplayer = stroeervideoplayer
    this.videoElement = stroeervideoplayer.getVideoEl()

    this.dataKeyMap = opts.dataKeyMap !== undefined ? opts.dataKeyMap : noop
    this.transformedData = []
    this.showFallback =
      opts.showFallback !== undefined ? opts.showFallback : false
    this.revolverplayTime =
      opts.revolverplayTime !== undefined ? opts.revolverplayTime : 5
    this.intervalTicker = null

    this.onLoadedCallback =
      opts.onLoadedCallback !== undefined ? opts.onLoadedCallback : noop
    this.onClickToPlayCallback =
      opts.onClickToPlayCallback !== undefined
        ? opts.onClickToPlayCallback
        : noop
    this.onClickToReplayCallback =
      opts.onClickToReplayCallback !== undefined
        ? opts.onClickToReplayCallback
        : noop
    this.onRevolverplayCallback =
      opts.onRevolverplayCallback !== undefined
        ? opts.onRevolverplayCallback
        : noop
    this.onRevolverplayPauseCallback =
      opts.onRevolverplayPauseCallback !== undefined
        ? opts.onRevolverplayPauseCallback
        : noop
    this.onPlayCallback = opts.onPlayCallback !== undefined ? opts.onPlayCallback : noop;

    this.transformApiData =
      opts.transformApiData !== undefined ? opts.transformApiData : noopData

    this.isVideoFinished = false
    this.uiEl = stroeervideoplayer.getUIEl()

    this.endcardContainer = document.createElement('div')
    this.endcardContainer.classList.add(
      'plugin-endcard-container',
      'endcard-hidden'
    )
    this.videoElement.after(this.endcardContainer)

    return this
  }

  dispatchEvent(eventName: string, data: object = {}): void {
    const event = new CustomEvent(eventName, { detail: data })
    this.videoplayer.getVideoEl().dispatchEvent(event)
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
    this.isVideoFinished = false
  }

  revolverplay = (): void => {
    if (this.revolverplayTime === 0 || this.showFallback) return

    /* eslint-disable-next-line */
    const progressSvgCircle = this.endcardContainer.querySelector(
      '[data-role="plugin-endcard-progress-value"]'
    )! as HTMLElement
    let remainingTime = this.revolverplayTime
    
    const revolverplayTicker = (): void => {
      ticker(this.revolverplayTime, remainingTime, progressSvgCircle)
      remainingTime--
      if (remainingTime < 0) {
        this.clearRevolverplayTimer()
        this.play(0, true)
        this.dispatchEvent('plugin-endcard:revolverplay')
        this.onRevolverplayCallback()
      }
    }

    revolverplayTicker()
    if (this.intervalTicker === null) {
      this.intervalTicker = setInterval(revolverplayTicker, 1000)
    }
  }

  clearRevolverplayTimer = (): void => {
    if (this.intervalTicker !== null) {
      clearInterval(this.intervalTicker)
      this.intervalTicker = null
    }
  }

  replay = (): void => {
    this.videoplayer.play()
  }

  setDuration = (duration: number): void => {
    this.videoplayer.getVideoEl().dataset.duration = duration.toString();
  }

  play = (idx: number, autoplay: boolean): void => {
    const nextVideo = this.transformedData[idx]
    this.setDuration(nextVideo.duration)
    this.setEndcardUrl(nextVideo.endpoint)
    this.videoplayer.replaceAndPlay(nextVideo, autoplay)
    this.onPlayCallback(nextVideo)
    this.dispatchEvent('plugin-endcard:play', nextVideo)
  }

  clickToPlay = (e: Event): void => {
    e.preventDefault()

    const el = (e.target as Element).closest(
      '[data-role="plugin-endcard-tile"]'
    )
    const idx: string | null = el !== null ? el.getAttribute('data-idx') : null
    if (idx === null) return
    this.play(parseInt(idx), false)
    this.dispatchEvent('plugin-endcard:click-to-play')
    this.onClickToPlayCallback()
  }

  clickToReplay = (e: Event): void => {
    e.preventDefault()
    e.stopPropagation()
    this.replay()
    this.dispatchEvent('plugin-endcard:click-to-replay')
    this.onClickToReplayCallback()
  }

  clickToPause = (e: Event): void => {
    const circles = this.endcardContainer.querySelectorAll(
      '[data-role="plugin-endcard-revolverplay-icon"] circle'
    )
    const target = e.currentTarget as HTMLElement

    e.preventDefault()
    e.stopPropagation()
    this.dispatchEvent('plugin-endcard:revolverplay-pause')
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
    const tiles = this.endcardContainer.querySelectorAll(
      '[data-role="plugin-endcard-tile"]'
    )
    const pauseButton = this.endcardContainer.querySelector(
      '[data-role="plugin-endcard-pause"]'
    )
    const replayTile = this.endcardContainer.querySelector(
      '[data-role="plugin-endcard-tile-replay"]'
    )

    tiles.forEach((tile) => {
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
    const tiles = this.endcardContainer.querySelectorAll(
      '[data-role="plugin-endcard-tile"]'
    )
    const pauseButton = this.endcardContainer.querySelector(
      '[data-role="plugin-endcard-pause"]'
    )
    const replayTile = this.endcardContainer.querySelector(
      '[data-role="plugin-endcard-tile-replay"]'
    )

    tiles.forEach((tile) => {
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
    const replayTemplate = getTileReplay(
      this.videoplayer.getPosterImage(),
      'plugin-endcard-tile-single'
    )
    this.endcardContainer.innerHTML += replayTemplate
    this.addClickEvents()
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
        this.transformedData = this.transformApiData(transformData(data, this.dataKeyMap))
        logger.log(this.transformedData)

        this.showFallback = false
        this.endcardContainer.innerHTML = ''

        for (let i: number = 0; i < 5; i++) {
          const tileTemplate = getTile(
            i,
            this.transformedData[i],
            this.revolverplayTime
          )
          const replayTemplate = getTileReplay(
            this.videoplayer.getPosterImage()
          )
          if (i === 3) {
            this.endcardContainer.innerHTML += replayTemplate
          }
          this.endcardContainer.innerHTML += tileTemplate
        }
        this.addClickEvents()
        if (this.isVideoFinished) {
          this.revolverplay()
        } 
      })
      .catch((err) => {
        logger.log('Something went wrong with fetching api!', err)
        this.showFallback = true
        this.renderFallback()
      })
  }

  hide = (): void => {
    if (this.uiEl.classList.contains('plugin-endcard-ui-small')) {
      this.uiEl.classList.remove('plugin-endcard-ui-small')
    }
    this.endcardContainer.classList.add('endcard-hidden')
  }

  show = (): void => {
    this.uiEl.classList.add('plugin-endcard-ui-small')
    this.isVideoFinished = true

    if (typeof this.videoplayer.exitFullscreen === 'function') {
      this.videoplayer.exitFullscreen()
    }
    if (this.endcardContainer.childNodes.length === 0) {
      this.showFallback = true
      this.renderFallback()
    } else {
      this.revolverplay()
    }
    this.endcardContainer.classList.remove('endcard-hidden')
    this.dispatchEvent('plugin-endcard:show')
    this.onLoadedCallback()
  }
}

export default EndcardPlugin
