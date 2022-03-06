import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { PointsMaterial } from 'three'

import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertShader from './shaders/portal/vertex.glsl'
import portalFragShader from './shaders/portal/fragment.glsl'

// import * as SPECTOR from 'spectorjs/dist'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

const parameters = {
    clearColour: 0x0d1720,
};


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
    side: THREE.DoubleSide
})

const portalLightMat = new THREE.ShaderMaterial({
    vertexShader: portalVertShader,
    fragmentShader: portalFragShader,
    uniforms: {
        uTime: {
            value: 0
        },
        uColourStart: {
            value: new THREE.Color(0x240F56)
        },
        uColourEnd: {
            value: new THREE.Color(0xbe2141)
        }
    }
});
/**
 * Model
*/
gltfLoader.load('./static/draco/portal.glb', 
    (glb) => {
        glb.scene.traverse((child) => {
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

// Fireflies
const firefliescount = 30;
const firefliesGeo = new THREE.BufferGeometry();
const positions = new Float32Array(firefliescount * 3);
const firefliesScale = new Float32Array(firefliescount);

for (var i = 0; i < firefliescount; i++) {
    const x = (Math.random() - 0.5) * 4;
    const y = Math.random() * 1.5;
    const z = (Math.random() - 0.5) * 4;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    firefliesScale[i] = Math.random();
}

const firefliesMat = new THREE.ShaderMaterial({
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    uniforms: {
        uTime:{
            value: 0.0
        },
        uPixelRatio: {
            value: Math.min(window.devicePixelRatio, 2),
        },
        uSize: {
            value: 200,
        }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
})

// const firefliesMat = new THREE.PointsMaterial({
//     size: 0.1,
//     color: 0xFFFFFF,
//     sizeAttenuation: false,
//     transparent: true,
//     blending: THREE.AdditiveBlending,
//     depthWrite: false,
// })

gui.add(firefliesMat.uniforms.uSize, 'value', 0, 500, 1).name('Fireflies Size');

firefliesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
firefliesGeo.setAttribute('aScale', new THREE.BufferAttribute(firefliesScale, 1));
const fireflies = new THREE.Points(firefliesGeo, firefliesMat);
console.log(fireflies)
scene.add(fireflies);

scene.fog = new THREE.Fog(0, 1, 20);


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

    // Update shaders
    firefliesMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
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
renderer.setClearColor(parameters.clearColour, 1)
renderer.outputEncoding = THREE.sRGBEncoding
gui.addColor(parameters, 'clearColour').onChange((value) => {
    renderer.setClearColor(value)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update materials
    firefliesMat.uniforms.uTime.value = elapsedTime;
    portalLightMat.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()