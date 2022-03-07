import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertex from './shaders/water/vertex.glsl';
import waterFragment from './shaders/water/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
var parameters = {
    troughColour: '#186691',
    crestColour: '#9bd8ff',
}

gui.addColor(parameters, 'troughColour').onChange(function (value) {
    waterMaterial.uniforms.uTroughColour.value.set(value)
});
gui.addColor(parameters, 'crestColour').onChange(function (value) {
    waterMaterial.uniforms.uCrestColour.value.set(value)
});

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(20, 20, 1024, 1024)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertex,
    fragmentShader: waterFragment,
    uniforms: {
        uTime: {
            value: 0
        },
        uBigWavesElevation: {
            value: 0.3
        },
        uBigWavesFrequency: {
            value: new THREE.Vector2(4,1.25)
        },
        uBigWavesSpeed: {
            value: 0.75
        },
        uSmallWavesElevation: {
            value: 0.15
        },
        uSmallWavesFrequency: {
            value: 3
        },
        uSmallWavesSpeed: {
            value: 0.2
        },
        uSmallWavesIter: {
            value: 4
        },
        uTroughColour: {
            value: new THREE.Color(parameters.troughColour)
        },
        uCrestColour: {
            value: new THREE.Color(parameters.crestColour)
        },
        uColourOffset: {
            value: 0.25
        },
        uColourMultiplier: {
            value: 0.5
        },
        uRandom: {
            value: Math.random()
        }
    }
})

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, 0.01).name('Wave Amplitude');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10, 0.01).name('Wave Frequency X');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10, 0.01).name('Wave Frequency Y');

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1, 0.01).name('Small Wave Amplitude');
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 1, 0.001).name('Small Wave Frequency');
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 1, 0.01).name('Small Wave Speed');
gui.add(waterMaterial.uniforms.uSmallWavesIter, 'value', 0, 10, 1).name('Small Wave Iterations');

gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 5, 0.01).name('Wave Speed');
gui.add(waterMaterial.uniforms.uColourOffset, 'value', -2, 2, 0.01).name('Colour Offset');
gui.add(waterMaterial.uniforms.uColourMultiplier, 'value', 0, 5, 0.01).name('Colour Multiplier');

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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

    // Update shaders
    waterMaterial.uniforms.uTime.value = elapsedTime
    // waterMaterial.uniforms.uRandom.value = Math.random();

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()