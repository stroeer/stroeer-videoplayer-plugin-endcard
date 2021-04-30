export interface IData {
  image: string
  title: string
  // add more
}

export interface IStroeerVideoplayer {
  getUIEl: Function
  getRootEl: Function
  getVideoEl: Function
  getUIName: Function
  initUI: Function
  deinitUI: Function
}

export interface IEndcardOptions {
  OnLoadedCallback?: Function
  OnClickCallback?: Function
  OnRevolverplayCallback?: Function
  OnRevolverplayPauseCallback?: Function
  dataKeyMap?: Object
}
