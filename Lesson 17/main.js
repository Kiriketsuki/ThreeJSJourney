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

// fog
const fog = new THREE.Fog(0x262837, 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('/static/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/static/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/static/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/static/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/static/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/static/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/static/textures/door/roughness.jpg');

const bricksColorTexture = textureLoader.load('/static/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/static/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/static/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/static/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/static/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/static/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/static/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/static/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
*/
// group
const house = new THREE.Group();
scene.add(house);

// walls 
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
        transparent: true,
    })
)
walls.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y += 2.5/2;
walls.castShadow = true;
walls.receiveShadow = true;
house.add(walls);

// roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,2,4),
    new THREE.MeshStandardMaterial({
        color: 'red'
    })
)
roof.rotateY(Math.PI/4);
roof.position.y += 3.2;
roof.castShadow = true;
roof.receiveShadow = true;
house.add(roof);

// door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
);

door.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);


door.position.y = 0.8;
door.position.z = 2.001;
house.add(door);

// bushes
const bushGeo = new THREE.SphereGeometry(1, 32, 32);
const bushMat = new THREE.MeshStandardMaterial({
    color: 'green'
});

const bush_1 = new THREE.Mesh(bushGeo, bushMat);
bush_1.scale.set(0.5, 0.5, 0.5);
bush_1.position.set(0.8, 0.2, 2.2);

const bush_2 = new THREE.Mesh(bushGeo, bushMat);
bush_2.scale.set(0.25, 0.25, 0.25);
bush_2.position.set(1.4, 0.1, 2.1);

const bush_3 = new THREE.Mesh(bushGeo, bushMat);
bush_3.scale.set(0.4, 0.4, 0.4);
bush_3.position.set(-0.8, 0.1, 2.2);

const bush_4 = new THREE.Mesh(bushGeo, bushMat);
bush_4.scale.set(0.15, 0.15, 0.15);
bush_4.position.set(-1, 0.05, 2.6);

bush_1.castShadow = true;
bush_1.receiveShadow = true;
bush_2.castShadow = true;
bush_2.receiveShadow = true;
bush_3.castShadow = true;
bush_3.receiveShadow = true;
bush_4.castShadow = true;
bush_4.receiveShadow = true;
house.add(bush_1, bush_2, bush_3, bush_4);

// graves
const graves = new THREE.Group();
scene.add(graves);
const gravesGeo = new THREE.BoxGeometry(0.45, 1, 0.1);
const gravesMat = new THREE.MeshStandardMaterial({
    color: 'grey'
});

for (var i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 6;
    const grave = new THREE.Mesh(gravesGeo, gravesMat);
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    grave.position.set(x, 0.4, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.7;
    grave.rotation.z = (Math.random() - 0.5) * 0.15;
    
    grave.castShadow = true;
    grave.receiveShadow = true;
    graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
)

floor.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);


floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9dfff', 0.13)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.5)
moonLight.castShadow = true;
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.castShadow = true;
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);


/**
 * Ghosts
*/

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)
ghost1.castShadow = true;
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)
ghost1.castShadow = true;
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)
ghost1.castShadow = true;

/**
 * Shadows
*/
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// ...

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

// ...

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

// ...

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

// ...

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

// ...


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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor(0x262837);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update ghost lights
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4.5
    ghost1.position.z = Math.sin(ghost1Angle) * 4.5
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Move camera
    const time = Math.floor(elapsedTime * 1000000)%2 + 1;
    camera.position.x = Math.cos(time * -0.02);
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()