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
    // TODO: isDesktop can be removed if UI plugin bug is fixed
    this.isDesktop = window.screen.width > 768

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

  revolverplay = (): void => {
    if (this.revolverplayTime === 0 || !this.showEndcard) return

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const progressSvgCircle = this.endcardContainer.querySelector('[data-role="plugin-endcard-progress-value"]')! as HTMLElement
    let remainingTime = this.revolverplayTime
    const revolverplayTicker = (): void => {
      ticker(this.revolverplayTime, remainingTime, progressSvgCircle, () => {
        this.play(0)
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
    this.clearRevolverplay()
    this.videoplayer.play()
    this.hide()
  }

  play = (idx: number): void => {
    this.clearRevolverplay()
    this.endpoint = this.transformedData[idx].endpoint
    this.videoplayer.replaceAndPlay(this.transformedData[idx])
    this.hide()
  }

  addClickEvents = (): void => {
    const tiles = this.endcardContainer.querySelectorAll('[data-role="plugin-endcard-tile"]')
    const pauseButton = this.endcardContainer.querySelector('[data-role="plugin-endcard-pause"]')
    const replayTile = this.endcardContainer.querySelector('[data-role="plugin-endcard-tile-replay"]')

    tiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        e.preventDefault()

        const el = (e.target as Element).closest('[data-role="plugin-endcard-tile"]')
        const idx: string | null = el !== null ? el.getAttribute('data-idx') : null
        if (idx === null) return
        this.play(parseInt(idx))
        this.onClickCallback()
      })
    })

    if (replayTile !== null) {
      replayTile.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.replay()
        // TODO: do we need this.onClickCallback() here?
      })
    }

    if (pauseButton !== null) {
      pauseButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.onRevolverplayPauseCallback()
        this.clearRevolverplay()
      })
    }
  }

  renderFallback = (): void => {
    const replayTemplate = getTileReplay(this.videoplayer.getVideoEl().getAttribute('poster'), 'plugin-endcard-tile-single')
    this.endcardContainer.innerHTML = ''
    this.endcardContainer.innerHTML += replayTemplate
  }

  render = (): void => {
    if (this.endpoint === null || !this.showEndcard) {
      this.showEndcard = false
      this.renderFallback()
      return
    }

    fetchAPI<object>(this.endpoint)
      .then((data) => {
        this.transformedData = transformData(data, this.dataKeyMap)
        logger.log(this.transformedData)
        console.log(this.transformedData)

        this.endcardContainer.innerHTML = ''
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
