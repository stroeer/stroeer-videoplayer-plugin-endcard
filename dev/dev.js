import StroeerVideoplayer from '@stroeer/stroeer-videoplayer'
import StroeerVideoplayerDefaultUI from '@stroeer/stroeer-videoplayer-default-ui'
import { StroeerVideoplayerEndcardPlugin } from './stroeerVideoplayer-endcard-plugin.esm'

StroeerVideoplayer.registerUI(StroeerVideoplayerDefaultUI)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerEndcardPlugin)

let videoData
let playRound = 0
const video = document.getElementById('myvideo')
video.addEventListener('error', function () {
  console.log('error', this.error.code, this.error.message)
})

video.addEventListener('firstPlay', function () {
  console.log('firstPlay')
})

video.addEventListener('contentVideoSeeked', function () {
  console.log('contentVideoSeeked')
})

video.addEventListener('contentVideoPause', function () {
  console.log('contentVideoPause')
})

video.addEventListener('contentVideoResume', function () {
  console.log('contentVideoResume')
})

video.addEventListener('replay', function () {
  console.log('replay')
})

video.addEventListener('contentVideoStart', function () {
  videoData = video.dataset.meta
  playRound++
  console.log('contentVideoStart', videoData)
  console.log('playRound: ', playRound)
  if (playRound === 3) {
    console.log('DEINIT')
    myvideoplayer.deinitPlugin('Endcard')
  }
})

video.addEventListener('contentVideoEnded', function () {
  console.log('contentVideoEnded')
})

video.addEventListener('contentVideoFirstQuartile', function () {
  console.log('contentVideoFirstQuartile')
})

video.addEventListener('contentVideoMidpoint', function () {
  console.log('contentVideoMidpoint')
})

video.addEventListener('contentVideoThirdQuartile', function () {
  console.log('contentVideoThirdQuartile')
})

video.addEventListener('plugin-endcard:show', function () {
  console.log('plugin-endcard:show')
})

video.addEventListener('plugin-endcard:click-to-play', function () {
  console.log('plugin-endcard:click-to-play')
})

video.addEventListener('plugin-endcard:click-to-replay', function () {
  console.log('plugin-endcard:click-to-replay')
})

video.addEventListener('plugin-endcard:revolverplay', function () {
  console.log('plugin-endcard:revolverplay')
})

video.addEventListener('plugin-endcard:revolverplay-pause', function () {
  console.log('plugin-endcard:revolverplay-pause')
})

const myvideoplayer = new StroeerVideoplayer(video)
myvideoplayer.loadStreamSource()
myvideoplayer.loadFirstChunk()

myvideoplayer.initPlugin('Endcard', {
  revolverplayTime: 7,
  dataKeyMap: {
    // key of endcard, key from API
    image_large: 'preview_image',
    image_medium: 'preview_image',
    image_small: 'thumbnail',
    endpoint: 'endcard_url',
    poster: 'preview_image', // TODO: remove after: change key poster in video-player to image_large
  },
  onLoadedCallback: () => {
    console.log('OnLoadedCallback triggered')
  },
  onClickToPlayCallback: () => {
    videoData = video.dataset.meta
    console.log('onClickToPlayCallback triggered', videoData)
  },
  onClickToReplayCallback: () => {
    videoData = video.dataset.meta
    console.log('onClickToReplayCallback triggered', videoData)
  },
  onRevolverplayCallback: () => {
    console.log('OnRevolverplayCallback triggered')
  },
  onRevolverplayPauseCallback: () => {
    console.log('OnRevolverplayPauseCallback triggered')
  }
})

console.log(myvideoplayer)
