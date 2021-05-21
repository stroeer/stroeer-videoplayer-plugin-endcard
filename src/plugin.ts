import { version } from '../package.json'
import noop from './noop'
import logger from './logger'
import { fetchAPI, transformData } from './api'
import getTile from './template'
import { IData, IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

class EndcardPlugin {
  videoplayer: IStroeerVideoplayer
  videoElement: HTMLVideoElement
  isMobile: boolean
  endcardContainer: HTMLDivElement
  endpoint: string | null
  onLoadedCallback: Function
  onClickCallback: Function
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

    this.endpoint = this.videoElement.getAttribute('data-endcard-url')
    this.dataKeyMap = opts.dataKeyMap !== undefined ? opts.dataKeyMap : noop
    this.transformedData = []
    this.showEndcard = true
    this.revolverplayTime = opts.revolverplayTime !== undefined ? opts.revolverplayTime : 5
    this.intervalTicker = null
    this.isMobile = false

    this.onLoadedCallback = opts.onLoadedCallback !== undefined ? opts.onLoadedCallback : noop
    this.onClickCallback = opts.onClickCallback !== undefined ? opts.onClickCallback : noop
    this.onRevolverplayCallback = opts.onRevolverplayCallback !== undefined ? opts.onRevolverplayCallback : noop
    this.onRevolverplayPauseCallback = opts.onRevolverplayPauseCallback !== undefined ? opts.onRevolverplayPauseCallback : noop

    this.uiEl = stroeervideoplayer.getUIEl()

    this.endcardContainer = document.createElement('div')
    this.endcardContainer.classList.add('plugin-endcard-container', 'hidden')
    this.videoElement.after(this.endcardContainer)

    return this
  }

  addMobileListener = (): void => {
    const controlbar: HTMLDivElement | null = this.uiEl.querySelector('.controlbar')
    const tileOverlay: HTMLDivElement | null = this.endcardContainer.querySelector('.plugin-endcard-tile .plugin-endcard-overlay')
    if (controlbar === null || tileOverlay === null) return

    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList): void => {
      if (e.matches) {
        tileOverlay.style.bottom = String(controlbar.offsetHeight) + 'px'
      } else {
        tileOverlay.style.bottom = '0'
      }
      this.isMobile = e.matches
    }

    handleMobileChange(mediaQuery)
    mediaQuery.addEventListener('change', handleMobileChange)
  }

  revolverplay = (): void => {
    if (this.revolverplayTime === 0) return

    const progressSvgCircle: HTMLElement | null =
      this.endcardContainer.querySelector('.plugin-endcard-progress-value')
    const radius = 30.667
    const circumference = 2 * Math.PI * radius
    let remainingTime = this.revolverplayTime

    const progress = (value: number): void => {
      const p = value / 100
      const dashOffset = circumference * (1 - p)
      if (progressSvgCircle === null) return
      progressSvgCircle.style.strokeDashoffset = String(dashOffset)
    }

    const ticker = (): void => {
      progress(((this.revolverplayTime - remainingTime) / this.revolverplayTime) * 100)
      remainingTime--
      if (remainingTime < -1) {
        this.play(0)
      }
    }

    ticker()
    this.intervalTicker = setInterval(ticker, 1000)
  }

  play = (idx: number): void => {
    if (this.intervalTicker !== null) {
      clearInterval(this.intervalTicker)
    }
    const videoSources = this.transformedData[idx].sources
    this.endpoint = this.transformedData[idx].endpoint
    this.videoplayer.setSrc(videoSources)
    this.videoplayer.load()
    this.videoplayer.play()
    this.hide()
  }

  addClickEvents = (): void => {
    const cards = this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-tile"]')
    const pauseButton = this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]')

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault()
        this.onClickCallback(this.videoElement)

        const el = (e.target as Element).closest('[data-role="plugin-endcard-tile"]')
        const idx: string | null = el !== null ? el.getAttribute('data-idx') : null
        if (idx === null) return
        this.play(parseInt(idx))
      })
    })

    if (pauseButton === null) return
    pauseButton.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.onRevolverplayPauseCallback(this.videoElement)
      if (this.intervalTicker == null) return
      clearInterval(this.intervalTicker)
    })
  }

  render = (): void => {
    if (this.endpoint === null) {
      this.showEndcard = false
      return
    }

    fetchAPI<object>(this.endpoint)
      .then((data) => {
        this.transformedData = transformData(data, this.dataKeyMap)
        logger.log(this.transformedData)

        this.endcardContainer.innerHTML = ''
        for (let i: number = 0; i < 6; i++) {
          const cardTemplate = getTile(i, this.transformedData[i], this.revolverplayTime)
          this.endcardContainer.innerHTML += cardTemplate
        }
      })
      .catch(err => {
        logger.log('Something went wrong with fetching api!', err)
        this.showEndcard = false
      })
  }

  hide = (): void => {
    if (!this.isMobile) {
      this.uiEl.classList.remove('hidden')
    }
    this.endcardContainer.classList.add('hidden')
  }

  show = (): void => {
    if (!this.isMobile) {
      this.uiEl.classList.add('hidden')
    }
    this.endcardContainer.classList.remove('hidden')
    this.onLoadedCallback(this.videoElement)
  }
}

const plugin = {
  pluginName: 'Endcard',
  init: (stroeervideoplayer: IStroeerVideoplayer, opts: IEndcardOptions = {}) => {
    logger.log('opts', opts)

    const endcardPlugin = new EndcardPlugin(stroeervideoplayer, opts)
    const videoEl = stroeervideoplayer.getVideoEl()

    // for development change "contentVideoFirstQuartile" to "loadedmetadata"
    videoEl.addEventListener('contentVideoFirstQuartile', () => {
      endcardPlugin.render()
    })

    // for development change "contentVideoEnded" to "loadedmetadata"
    videoEl.addEventListener('contentVideoEnded', () => {
      if (!endcardPlugin.showEndcard) return
      endcardPlugin.addMobileListener()
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
