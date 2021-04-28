let debugMode = true
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
  if (window.localStorage.getItem('StroeerVideoplayerDebugMode') !== null) {
    debugMode = true
  }
}
const logger = {
  log: function (...args: any[]) {
    if (debugMode) {
      console.log.apply(console, args)
    }
  }
}

export default logger