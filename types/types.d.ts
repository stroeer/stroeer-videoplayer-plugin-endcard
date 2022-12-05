export interface IData {
  title: string
  duration: number
  playlists?: string[]
  poster?: string
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
  // if stroeer-videoplayer-default-ui isn't used then there is no function exitFullscreen
  exitFullscreen?: Function
}

export interface IEndcardOptions {
  onLoadedCallback?: Function
  onClickToPlayCallback?: Function
  onClickToReplayCallback?: Function
  onRevolverplayCallback?: Function
  onRevolverplayPauseCallback?: Function
  onPlayCallback?: (data: IData) => void
  dataKeyMap?: Object
  revolverplayTime?: number
  showFallback?: boolean
  transformApiData?: (data: IData[]) => IData[]
}
