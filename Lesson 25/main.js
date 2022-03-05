import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const parameters = {
    'envMapIntensity': 5,
}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

// Texture
const environmentMap = cubeTextureLoader.load([
    './static/textures/environmentMaps/0/px.jpg',
    './static/textures/environmentMaps/0/nx.jpg',
    './static/textures/environmentMaps/0/py.jpg',
    './static/textures/environmentMaps/0/ny.jpg',
    './static/textures/environmentMaps/0/pz.jpg',
    './static/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;

// Objects
var mixer = null;
// gltfLoader.load(
//     './static/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) => {
//         gltf.scene.scale.set(10, 10, 10);
//         gltf.scene.position.set(0, -4, 0);
//         gui.add(gltf.scene.rotation, 'y', 0, 2 * Math.PI, 0.01).name('Helmet Rotation');
//         scene.add(gltf.scene);
//         mixer = new THREE.AnimationMixer(gltf.scene);
//         updateAllMaterials();
//         // const action = mixer.clipAction(gltf.animations[0]);
//         // action.play();
// })

gltfLoader.load(
    './static/models/hamburger.glb',
    (glb) => {
        glb.scene.scale.set(0.3,0.3,0.3);
        glb.scene.position.set(0,-4,0);
        scene.add(glb.scene);
        updateAllMaterials();
    }
)
    
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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024,1024);
directionalLight.shadow.normalBias = 0.05;

scene.add(directionalLight);
// const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(shadowHelper);

gui.add(directionalLight.position, 'x', -5, 5, 0.1);
gui.add(directionalLight.position, 'y', -5, 5, 0.1);
gui.add(directionalLight.position, 'z', -5, 5, 0.1);
gui.add(directionalLight, 'intensity', 0, 10, 0.01);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
.onFinishChange( () => {
    renderer.toneMapping = Number(renderer.toneMapping),
    updateAllMaterials()
})

gui.add(renderer, 'toneMappingExposure', 0, 5, 0.01).onChange( () => {
    updateAllMaterials()
})

// Update all materials

function updateAllMaterials() {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMap = environmentMap;
            child.material.envMapIntensity = parameters.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}

gui.add(parameters, 'envMapIntensity', 0, 10, 0.1).onChange(updateAllMaterials)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()