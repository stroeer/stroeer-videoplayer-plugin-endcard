export interface IData {
  poster: string
  title: string
  sources?: object[]
  playlists?: []
  endpoint: string
}

export interface IStroeerVideoplayer {
  getUIEl: Function
  getRootEl: Function
  getVideoEl: Function
  getPosterImage: () => string
  replaceAndPlay: Function
  play: Function
  load: Function
}

export interface IEndcardOptions {
  onLoadedCallback?: Function
  onClickToPlayCallback?: Function
  onClickToReplayCallback?: Function
  onRevolverplayCallback?: Function
  onRevolverplayPauseCallback?: Function
  dataKeyMap?: Object
  revolverplayTime?: number
  showEndcard?: boolean
}
