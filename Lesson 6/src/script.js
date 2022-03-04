import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Time
var time = Date.now();

const clock = new THREE.Clock();

gsap.to(mesh.rotation, {
    x: 5,
    y: 5,
    duration: 21,
    delay:2
})

loop();

// Animations
function loop() {
    // time
    const currTime = Date.now();
    const deltaTime = currTime - time; // to make the animation constant across devices with different fps
    time = currTime;

    // using clock
    const elapsedTime = clock.getElapsedTime();

    // update objects
    // mesh.rotation.x += 0.001 * deltaTime;
    // mesh.rotation.y -= 0.004 * deltaTime;
    // mesh.rotation.z -= 0.0001 * deltaTime;
    // mesh.rotation.x = elapsedTime * Math.PI;
    // mesh.rotation.y = Math.sin(elapsedTime);
    // mesh.rotation.z = Math.cos(elapsedTime);
    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);
    
    // renderer
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop); // recursively calls
}

loop();