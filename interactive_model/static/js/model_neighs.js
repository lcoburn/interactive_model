console.log("*** House Neighs Rear ***");
// console.log(Luke);
// console.log(houseInfoStr);
// console.log(houseData.houseInfo);
console.log(typeof housesGeometry);

import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { gsap } from "https://cdn.skypack.dev/gsap@3.9.1";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { JsonGeometryLoader } from "./JsonGeometryLoader.js";
import { GUI } from "https://cdn.skypack.dev/dat.gui";
import CubeUpdater from "./cubeupdater.js";

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
    "https://lukecoburn.s3.eu-west-2.amazonaws.com/house_neighs.json"
    // housesGeometry
);

loader.load().then((geometries) => {
    geometries.forEach((geometry, index) => {
        // Create a material
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });
        if (geometry.attributes.position.count !== 8) {
            material.color.set(0x555555);
            material.opacity = 1.0;
        }
        if (geometry.attributes.position.count == 4) {
            material.color.set(0x000000);
            material.opacity = 1.0;
        }
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
            document.getElementById("model-container-2").clientWidth - 30;
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

// var cube;
// var edges;
// var line;
// var width_box;
// var depth_box;
// var height_box;
// var box3;
// var size;
// var positions;
// var initialPosition;
// var ext_type = "rear";

// // var extensions = document.body.getAttribute('data-background');
// const loader1 = new JsonGeometryLoader(
//     "https://lukecoburn.s3.eu-west-2.amazonaws.com/extensions3.json"
// );

loader1.load().then((geometries) => {
    geometries.forEach((geometry, index) => {
        // Create a material
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 1,
        });
        // Create a mesh with the geometry and material
        cube = new THREE.Mesh(geometry, material);
        // edges = new THREE.EdgesGeometry(cube.geometry);
        // line = new THREE.LineSegments(
        //     edges,
        //     new THREE.LineBasicMaterial({ color: 0xffffff })
        // );
        // cube.add(line);
        // Add the mesh to the scene
        scene.add(cube);
    });

    // Create a new GUI
    var gui = new GUI({ autoPlace: false });
    gui.domElement.id = "gui";
    var customContainer = document.getElementById("my-gui-container-1");
    customContainer.appendChild(gui.domElement);

    // Append it to your container
    document.getElementById("my-gui-container-1").appendChild(gui.domElement);

    box3 = new THREE.Box3().setFromObject(cube);
    size = new THREE.Vector3();
    box3.getSize(size);

    // Dimensions
    width_box = size.x;
    height_box = size.y;
    depth_box = size.z;

    // Vertices
    positions = cube.geometry.attributes.position;
    // Print out the vertices
    for (let i = 0; i < positions.count; i++) {
        let x = positions.getX(i);
        let y = positions.getY(i);
        let z = positions.getZ(i);
        // console.log(`Vertex ${i}: X = ${x}, Y = ${y}, Z = ${z}`);
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

    // Get initial position
    initialPosition = new THREE.Vector3(
        positions.getX(0),
        positions.getY(0),
        positions.getZ(0)
    );

    CubeUpdater.updateCubeDepth(
        cube,
        cubeDimensions,
        initialPosition,
        ext_type
    );

    // Add sliders to the GUI
    gui.add(cubeDimensions, "depth", 2, 7).onChange((depth) =>
        CubeUpdater.updateCubeDepth(
            cube,
            { ...cubeDimensions, depth },
            initialPosition,
            ext_type
        )
    );

    gui.add(cubeDimensions, "width", 3, 6.5).onChange((width) =>
        CubeUpdater.updateCubeWidth(
            cube,
            { ...cubeDimensions, width },
            initialPosition,
            ext_type
        )
    );
});

// Sizes
const width = document.getElementById("model-container-2").clientWidth;
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
    200
);
camera.position.z = 30;
camera.position.x = 5;
camera.position.y = 14;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl-2");
// console.log(canvas);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);
