import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('./static/textures/matcaps/8.png');

/**
 * Font
*/
const fontLoader = new FontLoader();
fontLoader.load('./static/fonts/helvetiker_regular.typeface.json', function (font) {
    // Create a text geometry
    const textGeometry = new TextGeometry(
        'Kiriketsuki',
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
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     -textGeometry.boundingBox.max.z * 0.5
    // ) // Center the text
    textGeometry.center();

    console.log(textGeometry.boundingBox);

    // Create a text material
    const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
    });
    const text = new THREE.Mesh(
        textGeometry,
        textMaterial
    );
    scene.add(text);
});

/**
 * Objects
*/
const donutGeo = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
const donutMat = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
});

for (var i = 0; i < 1000; i++) {
    var donut = new THREE.Mesh(
        donutGeo,
        donutMat
    );
    donut.position.x = Math.random() * 20 - 10;
    donut.position.y = Math.random() * 20 - 10;
    donut.position.z = Math.random() * 20 - 10;

    donut.rotation.x = Math.sin(Math.random() * Math.PI);
    donut.rotation.y = Math.cos(Math.random() * Math.PI);

    var scale = Math.random() * 0.5;
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
}



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
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
 * Animate
 */
const clock = new THREE.Clock()

function loop() {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(loop)
}

loop()