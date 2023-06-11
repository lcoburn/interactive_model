import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.9.1';

// import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

console.log('***')

// Create Scene
const scene = new THREE.Scene();

// Sphere
const geometry = new THREE.SphereGeometry( 3, 32, 32 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff83 } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );


// Cube
// var geometry = new THREE.BoxGeometry(1, 1, 1); // parameters are width, height, and depth
// var material = new THREE.MeshBasicMaterial({color: 0x00ff00}); // green color
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// Sizes
const width = document.getElementById("model-container").clientWidth - 30 // - 30 to account for padding (15 either side)
const sizes = {
    width: width,
    height: 0.5 * width
}

// Light
const light = new THREE.PointLight(0xffffff, 1, 100) 
light.position.set(0, 10, 10)
scene.add( light )

// Camera
const camera = new THREE.PerspectiveCamera(45, (sizes.width / sizes.height), 0.1, 100 )
camera.position.z = 20
scene.add( camera );


// Renderer
const canvas = document.querySelector(".webgl");
console.log(canvas)
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height )
renderer.setPixelRatio(2)
renderer.render(scene, camera) 

// Controls
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

// Resize
window.addEventListener('resize',() => {
    // Update Sizes
    const newWidth = document.getElementById("model-container").clientWidth - 30;
    sizes.width = newWidth,
    sizes.height = 0.5 * newWidth,
    // Update Camera
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
    // controls.update()
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop)
}
loop()

// Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 }})
tl.fromTo(sphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })