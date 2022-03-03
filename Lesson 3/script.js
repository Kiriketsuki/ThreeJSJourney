// Need 4 items to start
// A scene, a camera, a renderer, and some objects
const canvas = document.querySelector('.webgl');
// Scene
//? a container, to hold all the objects

const scene = new THREE.Scene();

// Objects
//? things you want to display. you need a mesh object, formed from a geometry (shape) and a material

const redCubeGem = new THREE.BoxGeometry(1, 1, 1);
const redCubeMat = new THREE.MeshBasicMaterial({
     color: 'red', 
     wireframe: true 
});

const redCubeMesh = new THREE.Mesh(redCubeGem, redCubeMat);
scene.add(redCubeMesh);

// Camera
//? viewer's POV. can have many cameras and switch
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000); // 75 fov. vertical and in degrees 45 ~ 55
camera.position.z = 5;
camera.position.y = 2;
scene.add(camera);

// Renderer
//? the gpu starts drawing onto the canvasand the camera can see
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);