import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import * as SPECTOR from 'spectorjs/dist'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})
// SpectorJS
// const SPECTOR = require('spectorjs')
// var SPECTOR = require('spectorjs')
// var spector = new SPECTOR.spector();
// spector.displayUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./static/draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */

const bakedTexture = textureLoader.load('./static/draco/baked.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

/**
 * Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture
});

const poleLightMat = new THREE.MeshBasicMaterial({
    color: 0xFF5200,
    emissive: 0xFF5200,
    emissiveIntensity: 100,
    side: THREE.DoubleSide
})

const portalLightMat = new THREE.MeshBasicMaterial({
    color: 0x240F56,
    emissive: 0x240F56,
    emissiveIntensity: 100,
    side: THREE.DoubleSide
});
/**
 * Model
*/
gltfLoader.load('./static/draco/portal.glb', 
    (glb) => {
        glb.scene.traverse((child) => {
            console.log(child);
            child.material = bakedMaterial;
        })
        const lightAMesh = glb.scene.children.find((child) => {
            return child.name === 'lightA'
        });
        const lightBMesh = glb.scene.children.find((child) => {
            return child.name === 'lightB'
        });
        const portalMesh = glb.scene.children.find((child) => {
            return child.name === 'portal'
        });

        lightAMesh.material = poleLightMat;
        lightBMesh.material = poleLightMat;
        portalMesh.material = portalLightMat;
        scene.add(glb.scene);
    }
)


/**
 * Object
 */


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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

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