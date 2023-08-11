import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { gsap } from "https://cdn.skypack.dev/gsap@3.9.1";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { JsonGeometryLoader } from "./JsonGeometryLoader.js";
import { GUI } from "https://cdn.skypack.dev/dat.gui";
import CubeUpdater from "./cubeupdater.js";

// Event Listener for button click
document.addEventListener("DOMContentLoaded", (event) => {
    loadModel(currentKey);
    const buttons = document.querySelectorAll(".load-model-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => loadModel(button.id));
    });
});

// Load model function
export function loadModel(casekey) {
    console.log("****", casekey, typeof casekey);
    console.log("****>", adjustableCases);
    // Create Scene
    const scene = new THREE.Scene();

    // Geometry Loader
    const loader = new JsonGeometryLoader();

    let geometries = housesGeometry.Main.concat(
        housesGeometry.Left,
        housesGeometry.Right
    );

    // Adjust geometries so they are centered
    let normalizedGeometries = adjustAllGeomtries(
        geometries,
        centreX,
        centreY,
        centreZ
    );

    normalizedGeometries.forEach((geometryTemp, index) => {
        const geometry = loader.createGeometry(geometryTemp);
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

    loadExtensions(scene, loader, centreX, centreY, centreZ);

    // Sizes
    const width = document.getElementById("model-container").clientWidth;
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
    camera.position.z = 20;
    camera.position.x = 3;
    camera.position.y = 10;
    camera.lookAt(centreX, centreY, centreZ);
    scene.add(camera);

    // Renderer
    const canvas = document.querySelector(".webgl");
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(centreX, centreY, centreZ); // Set the orbit target to the scene center
    controls.update();
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 5;

    // Resize
    window.addEventListener("resize", () => {
        // Update Sizes
        const newWidth =
            document.getElementById("model-container").clientWidth - 30;
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
    // tl.fromTo(cube.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
}

function loadExtensions(scene, loader, centreX, centreY, centerZ) {
    let adjustableGeometries = adjustableCases[currentKey]["geometry"];
    console.log("adjustableGeometries", adjustableGeometries);
    adjustableGeometries = adjustAllGeomtries(
        adjustableGeometries,
        centreX,
        centreY,
        centerZ
    );

    adjustableGeometries.forEach((adjustableGeometry) => {
        let geometry = loader.createGeometry(adjustableGeometry);

        // Create a material
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 1,
        });
        // Create a mesh with the geometry and material
        let cube = new THREE.Mesh(geometry, material);
        const edges = new THREE.EdgesGeometry(cube.geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        cube.add(line);
        // Add the mesh to the scene
        scene.add(cube);
    });
}

function calculateCenter(vertices) {
    let centreX = 0;
    let centreY = 0;
    let centreZ = 0;
    for (let i = 0; i < vertices.length; i++) {
        centreX += vertices[i].x;
        centreY += vertices[i].y;
        centreZ += vertices[i].z;
    }
    centreX = centreX / vertices.length;
    centreY = centreY / vertices.length;
    centreZ = centreZ / vertices.length;
    return { centreX, centreY, centreZ };
}

function adjustAllGeomtries(geometries, centreX, centreY, centreZ) {
    return geometries;

    let newGeometries = [];
    geometries.forEach((geometry) => {
        let newGeometry = adjustGeometry(geometry, centreX, centreY, centreZ);
        newGeometries.push(newGeometry);
    });
    return newGeometries;
}

function adjustGeometry(geometry, centreX, centreY, centreZ) {
    let newGeometry = geometry;
    console.log(newGeometry.vertices.length, centreX, centreY, centreZ);
    for (let i = 0; i < newGeometry.vertices.length; i++) {
        newGeometry.vertices[i].x -= centreX;
        newGeometry.vertices[i].y -= centreY;
        newGeometry.vertices[i].z -= centreZ;
    }
    return newGeometry;
}