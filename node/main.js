const PixelPusher = require('node-pixel-pusher')
const nodeCanvas = require('canvas')

const MAX_FPS = 30

function createRenderer(device) {
  const width = device.deviceData.pixelsPerStrip
  const height = device.deviceData.numberStrips
  const canvas = nodeCanvas.createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  console.log(`Creating renderer ${width}x${height} ${MAX_FPS}fps`)

  device.startRendering(() => {
    // Render
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, width, height)

    // Get data
    const ImageData = ctx.getImageData(0, 0, width, height)

    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS)
}

const service = new PixelPusher.Service()

service.on('discover', (device) => {
  createRenderer(device)
})
