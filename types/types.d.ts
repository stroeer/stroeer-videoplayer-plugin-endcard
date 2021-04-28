// TODO: use better key names (current SMB keys)
export interface IApiData {
  created_at: string
  duration: number
  embed_url: string
  producer: string
  thumbnail: string // preview_image
  title: string
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
}