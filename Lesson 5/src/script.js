import './style.css'
import * as THREE from 'three'
import { Camera } from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 })
);

group.add(cube1);

const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 1, 32),
    new THREE.MeshBasicMaterial({ color: 0x00FF00 })
);
ring.position.x = 3;
group.add(ring);

//* Positioning
// mesh.position.set(0.7, -0.7, 1);
// Axes Helper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);


//* Scaling
// mesh.scale.x = 0.5;

//* Rotating
// mesh.rotation.y = Math.PI / 4;

//* Look at

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.x = 1
camera.position.y = 3
scene.add(camera)
// camera.lookAt(mesh.position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)