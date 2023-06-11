import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.9.1';

console.log('*** Teide ***')
const canvas = document.querySelector(".webgl-2");
const scene = new THREE.Scene();

var loader = new GLTFLoader();
var scriptTag = document.getElementById('myScript');
var modelPath = scriptTag.getAttribute('teide-model');
console.log('>>',modelPath)

loader.load(modelPath,  function (gltf) {
    console.log('&&&&&',gltf)
    gltf.scene.scale.set(0.001, 0.001, 0.001); // Adjust these values as needed
    scene.add(gltf.scene);
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());

    // Output the size of the model
    console.log('Size:', size);

    // Output the position of the model
    console.log('Position:', gltf.scene.position);

    // Sizes
    const width = document.getElementById("model-container-2").clientWidth - 30 // - 30 to account for padding (15 either side)
    const sizes = {
        width: width,
        height: 0.5 * width
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(75, (sizes.width / sizes.height), 0.000, 1000000 )
    camera.position.x = 10
    camera.position.y = 5
    camera.position.z = -10
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // look at the origin
    scene.add( camera);
    console.log(camera.position , sizes.width, sizes.height)

    // Renderer
    console.log(canvas)
    const renderer = new THREE.WebGLRenderer({canvas})
    renderer.setSize(sizes.width, sizes.height )
    renderer.setPixelRatio(2)
    document.getElementById('model-container-2').appendChild(renderer.domElement);

    // Light
    const light = new THREE.PointLight(0xffffff, 10, 1000) 
    light.position.set(5, 5, 5)
    light.lookAt(new THREE.Vector3(0, 0, 0)); // look at the origin
    scene.add( light )

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
        const newWidth = document.getElementById("model-container-2").clientWidth - 30;
        sizes.width = newWidth,
        sizes.height = 0.5 * newWidth,
        // Update Camera
        camera.aspect = sizes.width/sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
    })
    
    // Render loop
    const loop = () => {
        controls.update()
        renderer.render(scene, camera);
        window.requestAnimationFrame(loop)
    }
    loop()


    // Timeline magic
    const tl = gsap.timeline({ defaults: { duration: 1 }})
    tl.fromTo(gltf.scene.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })


},
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

},
function (error) {
    console.error(error);
}
);
