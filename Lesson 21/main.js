import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { NearestFilter } from 'three'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui.addColor(parameters, 'materialColor')
.onChange(() => {
    material.color.set(parameters.materialColor);
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
*/

/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('./static/textures/gradients/5.jpg');
gradientTexture.magFilter = NearestFilter;
gradientTexture.minFilter = NearestFilter;
gradientTexture.generateMipmaps = false;

const objectsGap = 5;

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
});

const object1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const object2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)

const object3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

object1.position.y = -objectsGap * 0;
object2.position.y = -objectsGap * 1;
object3.position.y = -objectsGap * 2;

object1.position.x = 2;
object2.position.x = -2;
object3.position.x = 2;

scene.add(object1, object2, object3);

const objects = [object1, object2, object3];

/**
 * Particles
*/

const particleCount = 200;
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

/**
 * Lights
*/
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)
scene.add(cameraGroup)

/**
 * Scroll
*/

var scrollY = window.scrollY;
var currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    var newSection = Math.round(scrollY / sizes.height);
    if (newSection != currentSection) {
        currentSection = newSection;
        gsap.to(
            objects[currentSection].rotation,
            {
                duration: 1.5,
                opacity: 1,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=10',
                z: '-=7'
            }
        )
    }
});


/**
 * Cursor
*/
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
var previousTime = 0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    // Animate camera
    camera.position.y = -(scrollY/sizes.height) * objectsGap;

    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.5 * (deltaTime * 30);
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.5 * (deltaTime * 30);

    // Animate objects
    for (var object of objects) {
        object.rotation.x += deltaTime * 0.1;
        object.rotation.y += deltaTime * 0.15;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()