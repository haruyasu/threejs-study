import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'

const loader = new THREE.TextureLoader()
const cross = loader.load('/particles/star_01.png')

const gltfLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100)

const particlesGeometry = new THREE.BufferGeometry()
const particlesCnt = 5000

const posArray = new Float32Array(particlesCnt * 3)

for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * (Math.random() * 5)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

const material = new THREE.PointsMaterial({
  size: 0.005
})


gltfLoader.load('/helicopter/scene.gltf', (gltf) => {
  gltf.scene.scale.set(0.0006, 0.0006, 0.0006)
  // scene.add(gltf.scene)
})


const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  map: cross,
  transparent: true,
  color: 'white',
})

// Mesh
const sphere = new THREE.Points(geometry, material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(sphere, particlesMesh)
scene.add(particlesMesh)

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'), 1)


document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event) {
  mouseY = event.clientY
  mouseX = event.clientX
}

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime
  particlesMesh.rotation.y = -0.1 * elapsedTime

  if (mouseX > 0) {
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008)
    particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00008)
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
