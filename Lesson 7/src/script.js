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
    width: 800,
    height: 600
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//      1*aspectRatio,
//     1,
//     -1,
//     0.1,
//     1000
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);


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