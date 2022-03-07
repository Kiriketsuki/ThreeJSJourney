import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragmented.glsl'


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
const parameters = {}
parameters.count = 500000
parameters.size = 0.8
parameters.radius = 4
parameters.branches = 5
parameters.spin = 1
parameters.speed = 0.5;
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const size = new Float32Array(parameters.count)
    const randomOffsets = new Float32Array(parameters.count * 3);

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)


    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Position
        var radius = Math.random() * parameters.radius;
        radius += 0.1;

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        randomOffsets[i3] = randomX;
        randomOffsets[i3 + 1] = randomY;
        randomOffsets[i3 + 2] = randomZ;

        positions[i3    ] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle) * radius 

        // Color
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / parameters.radius)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        // Size
        size[i] = Math.random() * 5;

    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(size, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomOffsets, 3));

    /**
     * Material
     */
    material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: 5 * parameters.size },
            uInsideColour: { value: new THREE.Color(parameters.insideColor) },
            uOutsideColour: { value: new THREE.Color(parameters.outsideColor) },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            uSpeed: { value: parameters.speed },
        }
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

gui.add(parameters, 'count').min(100).max(3000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(3).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'speed').min(-2).max(2).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy).name('Branch Width')
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy).name('Exponential');
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

// Reset
parameters.reset = () => {
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    generateGalaxy();
    moon.scale.set(1.1,1.1,1.1);
    clock.stop();
    clock.start();
}

gui.add(parameters, 'reset').name('Reset');

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

// Objects
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
import moonURL from './textures/lroc_color_poles_4k.png';
import displacementMapURL from './textures/ldem_4.png';
var moonTexture = textureLoader.load(moonURL);
var displacementMap = textureLoader.load(displacementMapURL);

const moonGeo = new THREE.SphereGeometry(0.03, 32, 32);
const moonMat = new THREE.MeshStandardMaterial({ map: moonTexture, displacementMap: displacementMap, displacementScale: 0.0001, roughness: 1, metalness: 0, depthWrite: true });
const moon = new THREE.Mesh(moonGeo, moonMat);

// Background
// const cubeMapLoader = new THREE.CubeTextureLoader();
// import pxURL from './textures/cubemap/1/px.png';
// import nxURL from './textures/cubemap/1/nx.png';
// import pyURL from './textures/cubemap/1/py.png';
// import nyURL from './textures/cubemap/1/ny.png';
// import pzURL from './textures/cubemap/1/pz.png';
// import nzURL from './textures/cubemap/1/nz.png';

// const bgTexture = cubeMapLoader.load([
//     pxURL, nxURL,
//     pyURL, nyURL,
//     pzURL, nzURL
// ]);

// bgTexture.wrapS = THREE.RepeatWrapping;
// bgTexture.wrapT = THREE.RepeatWrapping;
// bgTexture.format = THREE.RGBAFormat;
// bgTexture.minFilter = THREE.NearestFilter;
// bgTexture.magFilter = THREE.NearestFilter;
// bgTexture.mapping = THREE.EquirectangularRefractionMapping;
// const bgTexture = textureLoader.load('./textures/cubemap/nebula-02-high.png');
// scene.background = bgTexture;

// Lights

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 0);

var lightsOn = false;
parameters.lights = () => {
    if (lightsOn) {
        scene.remove(light);
        lightsOn = false;
    } else {
        scene.add(light);
        lightsOn = true;
    }
}

gui.add(parameters, 'lights').name('Lights')


loadingManager.onLoad = () =>
{
    generateGalaxy();
    tick();
    scene.add(moon);
}

// Background stars
var bgPositions = new Float32Array(120000);
for (var i = 0; i < bgPositions.length / 3; i++)
{
    bgPositions[i] = Math.random() * 200 - 100;
    bgPositions[i + 1] = Math.random() * 1;
    bgPositions[i + 2] = Math.random() * 200 - 100;
}

const bgGeo = new THREE.BufferGeometry();
bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
const bgMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1, sizeAttenuation: false});
var bgStars = new THREE.Points(bgGeo, bgMat);
console.log(bgStars)
scene.add(bgStars);

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
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor('#181823')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update shaders
    material.uniforms.uTime.value = elapsedTime;

    // Update Moon
    moon.rotation.y -= 0.05;
    var exponentTime = Math.pow(elapsedTime, 1.05);
    if (10/exponentTime < 1) {
        moon.scale.x += .05/exponentTime;
        moon.scale.y += .05/exponentTime;
        moon.scale.z += .05/exponentTime;

    }
    // moon.scale.x += 10/exponentTime;
    // moon.scale.y += 10/exponentTime;
    // moon.scale.z += 10/exponentTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
