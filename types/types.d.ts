export interface IData {
  poster: string
  title: string
  sources: object[]
  endpoint: string
  // add more
}

export interface IStroeerVideoplayer {
  getUIEl: Function
  getVideoEl: Function
  getPosterImage: () => string
  getEndcardUrl: () => string
  setAutoplay: Function
  replaceAndPlay: Function
  play: Function
  load: Function
  setContentVideo: Function
}

export interface IEndcardOptions {
  onLoadedCallback?: Function
  onClickCallback?: Function
  onRevolverplayCallback?: Function
  onRevolverplayPauseCallback?: Function
  dataKeyMap?: Object
  revolverplayTime?: number
  showEndcard?: boolean
}
