import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
*/
const parameters = {
    count: 500000,
    particleSize: 0.01,
    galaxyRadius: 5,
    branches: 5,
    spin: 0.5,
    branchWidth: 0.8,
    polynomial: 2,
    insideColour: '#ff6030',
    outsideColour: '#1b3984',
    speed: 0.01,
};

var particleGeo = null;
var particleMat = null;
var particles = null;
var galaxy = new THREE.Group();

function generateGalaxy() {
    // create count numbers of particles randomly
    // start with float32
    const positions = new Float32Array(parameters.count * 3)
    const colours = new Float32Array(parameters.count * 3)

    for (var i = 0 ; i < parameters.count; i++) {
        var i3 = i * 3;
        var radius = Math.random() * parameters.galaxyRadius;
        var spinAngle = radius * parameters.spin;
        var branch = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        var randX = (Math.random()) * parameters.branchWidth * (Math.random() < 0.5 ? 1 : -1);
        var randY = (Math.random()) * parameters.branchWidth * (Math.random() < 0.5 ? 1 : -1);
        var randZ = (Math.random()) * parameters.branchWidth * (Math.random() < 0.5 ? 1 : -1);

        // closer to 0, closer to the original position
        // instead of linear, make it polynomial
        randX = Math.pow(randX, parameters.polynomial);
        randY = Math.pow(randY, parameters.polynomial) * 2;
        randZ = Math.pow(randZ, parameters.polynomial);

        positions[i3] = Math.sin(branch + spinAngle) * radius + randX;
        positions[i3 + 1] = randY;
        positions[i3 + 2] = Math.cos(branch + spinAngle) * radius + randZ;

        // Colours

        const insideColour = new THREE.Color(parameters.insideColour);
        // console.log(insideColour)
        const outsideColour = new THREE.Color(parameters.outsideColour);
        // console.log(outsideColour)
        const mixedColour = insideColour.clone();
        mixedColour.lerp(outsideColour, radius / parameters.galaxyRadius);
        
        colours[i3] = mixedColour.r;
        colours[i3 + 1] = mixedColour.g;
        colours[i3 + 2] = mixedColour.b;
    }

    if (particles !== null && particles.parent == galaxy) {
        galaxy.remove(particles);
    }

    if (particleGeo !== null) {
        particleGeo.dispose();
    }

    if (particleMat !== null) {
        particleMat.dispose();
    }


    // Geometry
    particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    particleGeo.setAttribute(
        'color',
        new THREE.BufferAttribute(colours, 3)
    );
    

    // Material
    particleMat = new THREE.PointsMaterial({
        size: parameters.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    // Particles
    particles = new THREE.Points(particleGeo, particleMat);
    galaxy.add(particles);
    scene.add(galaxy);
};

generateGalaxy();

// User Controls
gui.add(parameters, 'count')
.min(1000)
.max(1000000)
.step(500)
.onFinishChange(() => {
    generateGalaxy();
})

gui.add(parameters, 'particleSize')
.min(0.001)
.max(0.1)
.step(0.001)
.onFinishChange(() => {
    generateGalaxy();
})

gui.add(parameters, 'galaxyRadius')
.min(1)
.max(20)
.step(0.5)
.onFinishChange(() => {
    generateGalaxy();
})

gui.add(parameters, 'branches')
.min(2)
.max(10)
.step(1)
.onFinishChange(() => {
    generateGalaxy();
})

gui.add(parameters, 'spin')
.min(-5)
.max(4.5)
.step(0.1)
.onFinishChange(() => {
    generateGalaxy();
})

gui.add(parameters, 'branchWidth')
.min(0)
.max(1)
.step(0.1)
.onFinishChange(() => {
    generateGalaxy();
})

gui.add(parameters, 'polynomial')
.min(1)
.max(5)
.step(1)
.onFinishChange(() => {
    generateGalaxy();
})

gui.addColor(parameters, 'insideColour')
.onChange(() => {
    generateGalaxy();
})

gui.addColor(parameters, 'outsideColour')
.onChange(() => {
    generateGalaxy();
})

gui.add(parameters, 'speed')
.min(-.1)
.max(.1)
.step(0.001)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update camera
    galaxy.rotateY(parameters.speed);

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()