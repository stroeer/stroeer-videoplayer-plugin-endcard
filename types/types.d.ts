export interface IData {
  image: string
  title: string
  sources: object[]
  endpoint: string
  // add more
}

export interface IStroeerVideoplayer {
  getUIEl: Function
  getVideoEl: Function
  setSrc: Function
  play: Function
  load: Function
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
