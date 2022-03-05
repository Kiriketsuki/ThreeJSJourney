import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
*/
 const gui = new dat.GUI();
const parameters = {
    radius: 0.5,
    position: {
        x: 0,
        y: 3,
        z: 0,
    },
    width: 1,
    height: 1,
    length: 1,
    gravity: -9.82,
};
gui.add(parameters, 'gravity', -100, 100, 1).onChange(() => {
    world.gravity.set(0, parameters.gravity, 0);
});

parameters.createSphere = () => {
    createSphere(
        parameters.radius,
        new THREE.Vector3(
            parameters.position.x,
            parameters.position.y,
            parameters.position.z,
        ),);
}

gui.add(parameters, 'createSphere')
gui.add(parameters, 'radius', 0.1, 10, 0.1);
gui.add(parameters.position, 'x', -10, 10, 0.1).name('Sphere x');
gui.add(parameters.position, 'y', 0, 10, 0.1).name('Sphere y');
gui.add(parameters.position, 'z', -10, 10, 0.1).name('Sphere z');

parameters.createBox = () => {
    createBox(
        parameters.width,
        parameters.height,
        parameters.length,
        new THREE.Vector3(
            parameters.position.x,
            parameters.position.y,
            parameters.position.z,
        ),);
}
gui.add(parameters, 'createBox')
gui.add(parameters, 'width', 0.1, 10, 0.1);
gui.add(parameters, 'height', 0.1, 10, 0.1);
gui.add(parameters, 'length', 0.1, 10, 0.1);

parameters.reset = () => {
    for (var object of physicalObjects) {
        // object.cannon.removeEventListener('collide', playHitSound);
        world.remove(object.cannon);
        scene.remove(object.three);
    }
    physicalObjects = [];
}

gui.add(parameters, 'reset');
////////////////////////////////////////////////////////////////////////////! //Physics////////////////////////////////////////////////////////////////////////

// World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, parameters.gravity, 0);

// Materials
const defaultPhyMat = new CANNON.Material('default');
const defaultContMat = new CANNON.ContactMaterial(
    defaultPhyMat,
    defaultPhyMat,
    {
        friction: 0.3,
        restitution: 0.8
    }
);
world.addContactMaterial(defaultContMat);
world.defaultContactMaterial = defaultContMat;

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ 
    mass: 0, 
    shape: floorShape,
    position: new CANNON.Vec3(0, 0, 0),
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);

// Objects


////////////////////////////////////////////////////////////////////////////! //Threejs////////////////////////////////////////////////////////////////////////

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
*/
const hitSound = new Audio('./static/sounds/hit.mp3');
function playHitSound(impact) {
    if (impact.contact.getImpactVelocityAlongNormal() > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
    }
}
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/static/textures/environmentMaps/4/px.png',
    '/static/textures/environmentMaps/4/nx.png',
    '/static/textures/environmentMaps/4/py.png',
    '/static/textures/environmentMaps/4/ny.png',
    '/static/textures/environmentMaps/4/pz.png',
    '/static/textures/environmentMaps/4/nz.png'
])


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
*/
const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
const sphereMat = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
})
var physicalObjects = [];

function createSphere(radius, position) {
    // Three.js
    const sphereThree = new THREE.Mesh(
        sphereGeo,
        sphereMat
    )
    sphereThree.scale.set(radius, radius, radius)
    sphereThree.position.copy(position);
    sphereThree.castShadow = true;
    scene.add(sphereThree);

    // Cannon
    const sphereCannon = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(radius),
        position: position,
    });
    sphereCannon.addEventListener('collide', function(e) {
        playHitSound(e);
    });
    world.addBody(sphereCannon);

    // Update objects
    physicalObjects.push({
        three: sphereThree,
        cannon: sphereCannon,
    });
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

function createBox(width, height, length, position) {
    // Three.js
    const boxThree = new THREE.Mesh(
        boxGeo,
        boxMat
    )
    boxThree.scale.set(width, height, length)
    boxThree.position.copy(position);
    boxThree.castShadow = true;
    scene.add(boxThree);

    // Cannon
    const boxCannon = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, length / 2)),
        position: position,
    });
    boxCannon.addEventListener('collide', function(e) {
        playHitSound(e);
    });
    world.addBody(boxCannon);

    // Update objects
    physicalObjects.push({
        three: boxThree,
        cannon: boxCannon,
    });
}

/**
 * Animate
 */
const clock = new THREE.Clock();
var prevTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - prevTime;
    prevTime = elapsedTime;
    // Update Physics
    world.step(1 / 60, deltaTime, 3);

    for (var object of physicalObjects) {
        object.three.position.copy(object.cannon.position);
        object.three.quaternion.copy(object.cannon.quaternion);
    }
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();