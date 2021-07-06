export interface IData {
  title: string
  sources?: object[]
  playlists?: string[]
  endpoint: string
  image_large: string
  image_medium: string
  image_small: string
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
