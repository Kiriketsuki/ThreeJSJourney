import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

// Debug
const gui = new dat.GUI();
const parameters = {
    color: 0xffffff,
    spin: () => {
        gsap.to(dodecahedron.rotation, {
            duration: 0.5,
            x: dodecahedron.rotation.x + 1,
            y: dodecahedron.rotation.y + 1,
            z: dodecahedron.rotation.z + 1
        })
    }
}

gui.add(parameters, 'spin');


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

const material = new THREE.MeshBasicMaterial({
    color: parameters.color,
    wireframe: true
})

const dodecahedron = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1, 0),
    material
)

scene.add(dodecahedron);
gui.add(dodecahedron.position, 'x')
.min(-3)
.max(3)
.step(0.01);

gui.add(dodecahedron.position, 'y')
.min(-3)
.max(3)
.step(0.01);

gui.add(dodecahedron.position, 'z')
.min(-3)
.max(3)
.step(0.01);

gui.add(dodecahedron, 'visible');
gui.add(dodecahedron.material, 'wireframe');
gui.addColor(parameters, 'color')
.onChange(() => {
    material.color.setHex(parameters.color);
});


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