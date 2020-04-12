const PixelPusher = require('node-pixel-pusher')
const THREE = require('three')

const MAX_FPS = 30

function createRenderer(device) {
  const width = device.deviceData.pixelsPerStrip
  const height = device.deviceData.numberStrips

  console.log(`Creating renderer ${width}x${height} ${MAX_FPS}fps`)

  // Create Scene
  const mainScene = new THREE.Scene()

  const fillLight = new THREE.PointLight(0x00aaff, 0.7, 20)
  fillLight.position.set(-5, 0, 5)
  mainScene.add(fillLight)
  const keyLight = new THREE.PointLight(0xff00ff, 2, 20)
  keyLight.position.set(5, 0, 0)
  mainScene.add(keyLight)

  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
  const cube = new THREE.Mesh(geometry, material)
  mainScene.add(cube)

  const camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 20)
  camera.position.z = 10

  // Create Renderer
  const renderer = new THREE.WebGLRenderer()
  document.body.appendChild(renderer.domElement)
  renderer.setSize(width, height)
  const offscreen = new OffscreenCanvas(width, height)
  const offscreenCtx = offscreen.getContext('2d')
  const clock = new THREE.Clock()

  device.startRendering(() => {
    // Animate
    const delta = clock.getDelta()
    cube.rotation.x += delta * 0.5
    cube.rotation.y += delta * 0.5

    // Render
    renderer.render(mainScene, camera)

    // Get data
    offscreenCtx.drawImage(renderer.domElement, 0, 0)
    const ImageData = offscreenCtx.getImageData(0, 0, width, height)

    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS)
}

const service = new PixelPusher.Service()

service.on('discover', (device) => {
  createRenderer(device)
})
