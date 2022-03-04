import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * Debug
*/
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.getWorldPosition.x = 2;
pointLight.getWorldPosition.y = 3;
pointLight.getWorldPosition.z = 4;

scene.add(pointLight);

/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('./textures/door/color.jpg');
const alphaTexture = textureLoader.load('./textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('./textures/door/height.jpg');
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg');
const normalTexture = textureLoader.load('./textures/door/normal.jpg');
const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg');

const gradientTexture = textureLoader.load('./textures/gradients/3.jpg');

const matcapTexture = textureLoader.load('./textures/matcaps/1.png');

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environMapTexture = cubeTextureLoader.load([
    './textures/environmentMaps/0/px.jpg',
    './textures/environmentMaps/0/nx.jpg',
    './textures/environmentMaps/0/py.jpg',
    './textures/environmentMaps/0/ny.jpg',
    './textures/environmentMaps/0/pz.jpg',
    './textures/environmentMaps/0/nz.jpg'
]);

scene.background = environMapTexture
/**
 * Objects
*/
// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// material.color = new THREE.Color(0xffff00);
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0xff0000);

// const material = new THREE.MeshToonMaterial();
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial();
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.alphaMap = alphaTexture;
// material.transparent = true;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environMapTexture;

gui.add(material, 'metalness')
.min(0)
.max(1)
.step(0.01);

gui.add(material, 'roughness')
.min(0)
.max(1)
.step(0.01);

gui.add(material, 'aoMapIntensity', 0, 10, 0.1);

gui.add(material, 'displacementScale', 0, 1, 0.01);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
);
sphere.position.x += 1.5;
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

scene.add(sphere);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
);
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

scene.add(plane);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
);
torus.position.x -= 1.5;
torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

scene.add(torus);

/**
 * Animate
 */
const clock = new THREE.Clock();

function loop() {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = elapsedTime;
    sphere.rotation.x = elapsedTime * 0.5;
    torus.rotation.x = elapsedTime;
    torus.rotation.y = elapsedTime * 0.5;
    plane.rotation.z = elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(loop);
}

loop();