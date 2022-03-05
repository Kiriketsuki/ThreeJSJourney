import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { NearestFilter } from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

// Debug
// const gui = new dat.GUI();

// Parameters
const parameters = {
    width: window.innerWidth,
    height: window.innerHeight,
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
import colourURL from './static/textures/lroc_color_poles_4k.png';
const moonColourTexture = textureLoader.load(colourURL);
import displacementURL from './static/textures/ldem_4.png'
const moonDisplacementTexture = textureLoader.load(displacementURL);

loadingManager.onLoad = () => {
    console.log("loaded");
    loop();
}
// Fonts
const fontLoader = new FontLoader();
import fontURL from './static/fonts/helvetiker_regular.typeface.json';
const font = fontLoader.parse(fontURL);

// Raycaster
const raycaster = new THREE.Raycaster();

// * Objects
// Name
function parseFont (font, text) {
    const textGeometry = new TextGeometry(
        text,
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
        }
    );
    textGeometry.center();

    const textMat = new THREE.MeshNormalMaterial();
    var name = new THREE.Mesh(textGeometry, textMat);
    return name
}
var text = "Tetsuhiro"
var name = parseFont(font, text);
scene.add(name);

// Moon
const moonGeo = new THREE.SphereGeometry(1, 32, 32);
const moonMat = new THREE.MeshStandardMaterial({
    map: moonColourTexture,
    displacementMap: moonDisplacementTexture,
    displacementScale: 0.0001,
});
var moon = new THREE.Mesh(moonGeo, moonMat);
scene.add(moon);

// Coin
var coinGroup = new THREE.Group();
const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
const coinMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
});
var coin = new THREE.Mesh(coinGeo, coinMat);
coin.rotateX(Math.PI / 2);
coinGroup.add(coin);
scene.add(coinGroup);

// Coin Text
function parseFont_2(font, text) {
    const textGeometry = new TextGeometry(
        text,
        {
            font: font,
            size: 0.1,
            height: 0.000001,
            curveSegments: 4,
            bevelEnabled: false,
            bevelThickness: 0.003,
            bevelSize: 0.001,
            bevelOffset: 0,
            bevelSegments: 4
        }
    );
    textGeometry.center();

    const textMat = new THREE.MeshNormalMaterial();
    var to_return = new THREE.Mesh(textGeometry, textMat);
    return to_return
}
var coinText_1 = "s-s-sure";
var coinText_2 = "SURE!!::)))";

var text_1 = parseFont_2(font, coinText_1);
text_1.position.z = 0.11;
var text_2 = parseFont_2(font, coinText_2);
text_2.position.z = -0.11;
text_2.rotation.y = Math.PI;

const objects = [name, moon, coinGroup];
const objectsGap = 4;

name.position.y = -objectsGap * 0;
moon.position.y = -objectsGap * 1;
coinGroup.position.y = -objectsGap * 2;


coinGroup.add(text_1, text_2);

moon.position.x = -2;
coinGroup.position.x = 2;

// Particles
const particleCount = 1000;
const particleGeo = new THREE.BufferGeometry();
const particleSize = 0.03;
const particleMat = new THREE.PointsMaterial({
    color: 'white',
    size: particleSize,
    sizeAttenuation: true
});
const positions = new Float32Array(particleCount * 3);

for (var i = 0; i < particleCount; i++) {
    var i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = objectsGap * 0.5 - Math.random() * objectsGap * objects.length;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// * Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
// scene.add(lightHelper);
directionalLight.position.set(2, 1, 1);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Resize
window.addEventListener('resize', () =>
{
    // Update sizes
    parameters.width = window.innerWidth;
    parameters.height = window.innerHeight;

    // Update camera
    camera.aspect = parameters.width / parameters.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(parameters.width, parameters.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Camera
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(35, parameters.width / parameters.height, 0.1, 1000);
camera.position.z = 6;
cameraGroup.add(camera);
scene.add(cameraGroup);

// Scroll

var scrollY = window.scrollY;
var currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    var newSection = Math.round(scrollY / parameters.height);
    if (newSection != currentSection) {
        currentSection = newSection;
        gsap.to(
            objects[currentSection].rotation,
            {
                duration: 2,
                opacity: 1,
                ease: 'power2.inOut',
                y: `+= ${Math.PI * 3}`,
            }
        )
    }
});

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / parameters.width - 0.5;
    cursor.y = event.clientY / parameters.height - 0.5;
})

window.addEventListener('click', (event) => {
    if (previouslyIntersected) {
        console.log("clicked");
    }
});

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(parameters.width, parameters.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.maxDistance = 6;
controls.minDistance = 6;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 2;
controls.enableRotate = false;

// Animation Loop
const clock = new THREE.Clock();
var previousTime = 0;

function loop() {
    // elapsed time
    const elapsed = clock.getElapsedTime();
    const delta = elapsed - previousTime;
    previousTime = elapsed;

    // Animate camera
    camera.position.y = -(scrollY/parameters.height) * objectsGap;

    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.5 * (delta * 30);
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.5 * (delta * 30);

    // Animate objects
    for (var object of objects) {
        object.position.x -= Math.sin(elapsed * 2) * 0.001;
        object.rotation.z -= Math.cos(elapsed * 2) * 0.001;
    }



    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

// loop();
// Misc Functions