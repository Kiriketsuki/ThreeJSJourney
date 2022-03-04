import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
});

window.addEventListener("dblclick", (e) => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        wireframe: true })
)
// scene.add(mesh);

const dodecahedron = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        wireframe: true })
)

// scene.add(dodecahedron);

const buffGeometry = new THREE.BufferGeometry();
const count = 50000;
const positionArr = new Float32Array(count * 3 * 3);

for (var i = 0; i < count * 3 * 3; i++) {
    positionArr[i] = Math.random();
}

const positionAttr = new THREE.BufferAttribute(positionArr, 3);
buffGeometry.setAttribute('position', positionAttr);
const buffMesh = new THREE.Mesh(
    buffGeometry,
    new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        wireframe: true })
);
scene.add(buffMesh);


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Cursor controls
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (e) => {
    cursor.x = e.x/sizes.width - 0.5;
    cursor.y = e.y/sizes.height - 0.5;

});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animate
const clock = new THREE.Clock();

function loop() {
    const elapsedTime = clock.getElapsedTime();
    
    // Update camera
    // camera.position.x = 3 * Math.sin(-cursor.x * Math.PI * 2)
    // camera.position.y = cursor.y * 10;
    // camera.position.z = 3 * Math.cos(-cursor.x * Math.PI * 2);
    // camera.lookAt(mesh.position);
    
    controls.update();



    // render
    window.requestAnimationFrame(loop);
    renderer.render(scene, camera);
};

loop();