console.log("*** House ***");

import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { gsap } from "https://cdn.skypack.dev/gsap@3.9.1";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { JsonGeometryLoader } from "./JsonGeometryLoader.js";
import { GUI } from "https://cdn.skypack.dev/dat.gui";

AWS.config.update({
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
    region: "eu-west-2",
});

// Create Scene
const scene = new THREE.Scene();
// var scriptTag = document.getElementById('myScript');
// var extensionsJsonPath = scriptTag.getAttribute('extensions-json');
// var houseJsonPath = scriptTag.getAttribute('house.json');
const loader = new JsonGeometryLoader(
    "https://lukecoburn.s3.eu-west-2.amazonaws.com/house.json"
);

loader.load().then((geometries) => {
    geometries.forEach((geometry, index) => {
        // Create a material
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
        });
        // Create a mesh with the geometry and material
        const cube = new THREE.Mesh(geometry, material);
        const edges = new THREE.EdgesGeometry(cube.geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        cube.add(line);
        // Add the mesh to the scene
        scene.add(cube);
    });

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 5;

    // Resize
    window.addEventListener("resize", () => {
        // Update Sizes
        const newWidth =
            document.getElementById("model-container-1").clientWidth - 30;
        (sizes.width = newWidth),
            (sizes.height = 0.5 * newWidth),
            // Update Camera
            (camera.aspect = sizes.width / sizes.height);
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
    });

    const loop = () => {
        // controls.update()
        renderer.render(scene, camera);
        window.requestAnimationFrame(loop);
    };
    loop();

    // Timeline magic
    const tl = gsap.timeline({ defaults: { duration: 1 } });
    // tl.fromTo(cube.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
});

var cube;
var edges;
var line;
var width_box;
var depth_box;
var height_box;
var box3;
var size;
var positions;
var initialPosition;

// var extensions = document.body.getAttribute('data-background');
const loader1 = new JsonGeometryLoader(
    "https://lukecoburn.s3.eu-west-2.amazonaws.com/extensions.json"
);

loader1.load().then((geometries) => {
    geometries.forEach((geometry, index) => {
        // Create a material
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
        });
        // Create a mesh with the geometry and material
        cube = new THREE.Mesh(geometry, material);
        edges = new THREE.EdgesGeometry(cube.geometry);
        line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        cube.add(line);
        // Add the mesh to the scene
        scene.add(cube);
    });

    // Create a new GUI
    var gui = new GUI({ autoPlace: true });

    // Append it to your container
    document.getElementById("my-gui-container").appendChild(gui.domElement);

    box3 = new THREE.Box3().setFromObject(cube);
    size = new THREE.Vector3();
    box3.getSize(size);

    // Dimensions
    width_box = size.x;
    height_box = size.y;
    depth_box = size.z;
    console.log(width_box, depth_box, height_box);

    // Vertices
    positions = cube.geometry.attributes.position;
    // Print out the vertices
    for (let i = 0; i < positions.count; i++) {
        let x = positions.getX(i);
        let y = positions.getY(i);
        let z = positions.getZ(i);
        console.log(`Vertex ${i}: X = ${x}, Y = ${y}, Z = ${z}`);
    }

    // Create an object for the cube's dimensions
    var cubeDimensions = {
        width: width_box,
        depth: depth_box,
        height: height_box,
        color1: "#00ff00",
        color2: "#ffa500",
        color3: "#ff0000",
    };
    var oldDepth = cubeDimensions.depth;

    // Get initial position
    initialPosition = new THREE.Vector3(
        positions.getX(0),
        positions.getY(0),
        positions.getZ(0)
    );

    updateCube();

    // Add sliders to the GUI
    gui.add(cubeDimensions, "depth", 2, 7).onChange(updateCube);

    // Define a function to update the cube
    function updateCube() {
        // cube.scale.set(cubeScale.scaleX, cubeScale.scaleY, cubeScale.scaleZ);

        cube.geometry.dispose();
        // cube.line.dispose();

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.width,
            cubeDimensions.height,
            cubeDimensions.depth
        ); // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        let depthChange = cubeDimensions.depth - oldDepth;
        cube.position.z += depthChange / 2.0;
        oldDepth = cubeDimensions.depth;
        cube.position.z += cubeDimensions.depth / 2.0;
        cube.position.x += cubeDimensions.width / 2.0;
        cube.position.y += cubeDimensions.height / 2.0;

        // recalculate the edges and lines
        if (line) {
            line.geometry.dispose();
            line.material.dispose();
            cube.remove(line);
        }
        edges = new THREE.EdgesGeometry(cube.geometry);
        line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        cube.add(line);

        if (cubeDimensions.depth <= 3.0) {
            cube.material.color.set(cubeDimensions.color1);
        } else if (cubeDimensions.depth <= 6.0) {
            cube.material.color.set(cubeDimensions.color2);
        } else {
            cube.material.color.set(cubeDimensions.color3);
        }
    }
});

// Sizes
const width = document.getElementById("model-container-1").clientWidth - 30; // - 30 to account for padding (15 either side)
const sizes = {
    width: width,
    height: 0.5 * width,
};

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.z = 20;
camera.position.x = 15;
camera.position.y = 10;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl-1");
console.log(canvas);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);
