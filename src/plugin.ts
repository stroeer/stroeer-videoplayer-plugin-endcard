import { version } from '../package.json'
import noop from './noop'
import logger from './logger'
import { fetchAPI, transformData } from './api'
import { getTile, getTileReplay } from './template'
import { IData, IStroeerVideoplayer, IEndcardOptions } from '../types/types'
import './endcard.scss'

class EndcardPlugin {
  videoplayer: IStroeerVideoplayer
  videoElement: HTMLVideoElement
  isDesktop: boolean
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
    this.showEndcard = opts.showEndcard !== undefined ? opts.showEndcard : true
    this.revolverplayTime = opts.revolverplayTime !== undefined ? opts.revolverplayTime : 5
    this.intervalTicker = null
    this.isDesktop = false

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

  addMediaQueryListener = (): void => {
    const controlbar: HTMLDivElement | null = this.uiEl.querySelector('.controlbar')
    const tileOverlay: HTMLDivElement | null =
      this.endcardContainer.querySelector('[data-role="plugin-endcard-overlay"]')
    if (controlbar === null || tileOverlay === null) return

    const mediaQuery = window.matchMedia('(min-width: 769px)')
    const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList): void => {
      this.isDesktop = e.matches

      if (this.isDesktop) {
        tileOverlay.removeAttribute('style')
      } else {
        tileOverlay.style.bottom = String(controlbar.offsetHeight) + 'px'
      }
    }

    handleMobileChange(mediaQuery)
    if (mediaQuery.addEventListener === undefined) {
      mediaQuery.addListener(handleMobileChange)
    } else {
      mediaQuery.addEventListener('change', handleMobileChange)
    }
  }

  revolverplay = (): void => {
    if (this.revolverplayTime === 0 || !this.showEndcard) return

    const progressSvgCircle: HTMLElement | null =
      this.endcardContainer.querySelector('[data-role="plugin-endcard-progress-value"]')
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

  clearRevolverplay = (): void => {
    if (this.intervalTicker !== null) {
      clearInterval(this.intervalTicker)
    }
  }

  replay = (): void => {
    this.clearRevolverplay()
    this.videoplayer.play()
    this.hide()
  }

  play = (idx: number): void => {
    const videoSources = this.transformedData[idx].sources
    this.clearRevolverplay()
    this.endpoint = this.transformedData[idx].endpoint
    this.videoplayer.setSrc(videoSources)
    this.videoplayer.load()
    this.videoplayer.play()
    this.hide()
  }

  addClickEvents = (): void => {
    const tiles = this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-tile"]')
    const pauseButton = this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]')
    const replayTile = this.endcardContainer.querySelector('[data-role="plugin-endcard-tile-replay"]')

    tiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        e.preventDefault()
        this.onClickCallback(this.videoElement)

        const el = (e.target as Element).closest('[data-role="plugin-endcard-tile"]')
        const idx: string | null = el !== null ? el.getAttribute('data-idx') : null
        if (idx === null) return
        this.play(parseInt(idx))
      })
    })

    if (replayTile !== null) {
      replayTile.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.replay()
      })
    }

    if (pauseButton !== null) {
      pauseButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.onRevolverplayPauseCallback(this.videoElement)
        this.clearRevolverplay()
      })
    }
  }

  renderDefault = (): void => {
    const replayTemplate = getTileReplay(this.videoplayer.getVideoEl().getAttribute('poster'), 'plugin-endcard-tile-single')
    this.endcardContainer.innerHTML = ''
    this.endcardContainer.innerHTML += replayTemplate
  }

  render = (): void => {
    if (this.endpoint === null || !this.showEndcard) {
      this.showEndcard = false
      this.renderDefault()
      return
    }

    fetchAPI<object>(this.endpoint)
      .then((data) => {
        this.transformedData = transformData(data, this.dataKeyMap)
        logger.log(this.transformedData)

        this.endcardContainer.innerHTML = ''
        for (let i: number = 0; i < 5; i++) {
          const tileTemplate = getTile(i, this.transformedData[i], this.revolverplayTime)
          // TODO: maybe there will be a getPosterImage function in videplayer in future
          const replayTemplate = getTileReplay(this.videoplayer.getVideoEl().getAttribute('poster'))
          if (i === 3) {
            this.endcardContainer.innerHTML += replayTemplate
          }
          this.endcardContainer.innerHTML += tileTemplate
        }
      })
      .catch(err => {
        logger.log('Something went wrong with fetching api!', err)
        this.showEndcard = false
        this.renderDefault()
      })
  }

  hide = (): void => {
    // TODO: this should be done in UI plugin, here because to show endcard features
    if (this.isDesktop || !this.showEndcard) {
      this.uiEl.classList.remove('hidden')
    }
    this.endcardContainer.classList.add('hidden')
  }

  show = (): void => {
    // TODO: this should be done in UI plugin, here because to show endcard features
    if (this.isDesktop || !this.showEndcard) {
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

    videoEl.addEventListener('contentVideoFirstQuartile', () => {
      endcardPlugin.render()
    })

    videoEl.addEventListener('contentVideoEnded', () => {
      endcardPlugin.addMediaQueryListener()
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
