import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/static/textures/particles/9.png')

/**
 * Particles
*/
const particleGeo = new THREE.BufferGeometry();
const particleMat = new THREE.PointsMaterial({
    size: 0.09,
    sizeAttenuation: true,
})

particleMat.alphaMap = particleTexture;
particleMat.transparent = true;
particleMat.alphaTest = 0.001;
particleMat.vertexColors = true;

const count = 30000;
const positions = new Float32Array(count * 3);
const colours = new Float32Array(count * 3);

for (var i = 0; i < count * 3; i++) {
    // curr pos = i * 1
    positions[i] = (Math.random() - 0.5) * 20;
    colours[i] = (Math.random());
}


particleGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particleGeo.setAttribute(
    'color',
    new THREE.BufferAttribute(colours, 3)
)

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()