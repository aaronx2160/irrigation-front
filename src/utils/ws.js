


export default class SocketService {
  static instance = null

  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }
  ws = null
  callBackMapping = {}

  connect() {
    if (!window.WebSocket) {
      return console.log('websocket is not supported on your browser')
    }
    this.ws = new WebSocket('ws://106.14.35.126:5001')
    this.ws.onopen = this.onWsOpen
    this.ws.onclose = () => {
      console.log('ws connection closed')
    }
    this.ws.onmessage = msg => {
      const recvData = JSON.parse(msg.data)
      const { socketType } = recvData
      if (this.callBackMapping[socketType]) {
        const { action } = recvData
        if (action === 'getData') {
          const realData = recvData.data
          this.callBackMapping[socketType].call(this, realData)
        }
      }
    }
  }

  registerCallback(socketType, cb) {
    this.callBackMapping[socketType] = cb
  }
  unregisterCallback(socketType) {
    this.callBackMapping[socketType] = null
  }

  onWsOpen(cb){
if(cb){
  console.log('ws connected')
  cb()
}
  }

  send(data) {
      this.ws.send(JSON.stringify(data))
  }
}