import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { gsap } from "https://cdn.skypack.dev/gsap@3.9.1";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { JsonGeometryLoader } from "./JsonGeometryLoader.js";
import { GUI } from "https://cdn.skypack.dev/dat.gui";
import CubeUpdater from "./cubeupdaternew.js";

// Event Listener for button click
document.addEventListener("DOMContentLoaded", (event) => {
    loadModel();
    const buttons = document.querySelectorAll(".load-model-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            loadModel();
        });
    });
});

// Load model function
export function loadModel() {
    // Create Scene
    const scene = new THREE.Scene();

    // Geometry Loader
    const loader = new JsonGeometryLoader();

    let geometries = housesGeometry.Main.concat(
        housesGeometry.Left,
        housesGeometry.Right
    );
    var house_width = Math.abs(
        geometries[0].vertices[1].x - geometries[0].vertices[0].x
    );
    var house_depth = Math.abs(
        geometries[0].vertices[2].z - geometries[0].vertices[0].z
    );

    geometries.forEach((geometryTemp, index) => {
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

    loadExtensions(scene, loader, house_width, house_depth);

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
}

function loadExtensions(scene, loader, house_width, house_depth) {
    let adjustableGeometries = adjustableCases[currentKey]["geometry"];
    var adjustable_values;
    var adjustable_walls;
    // Variables for dimensions
    let count = 0;

    // remove existing GUI;
    for (let i = 1; i < 4; i++) {
        document.getElementById(`my-gui-container-${i}`).innerHTML = "";
    }

    adjustableGeometries.forEach((adjustableGeometry) => {
        let geometry = loader.createGeometry(adjustableGeometry);
        adjustable_values =
            adjustableCases[currentKey].geometry[count].adjustable_values;
        adjustable_walls =
            adjustableCases[currentKey].geometry[count].adjustable_walls;

        // Create a material
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            opacity: 1,
        });
        // Create a mesh with the geometry and material
        let cube = new THREE.Mesh(geometry, material);
        // Add the mesh to the scene
        scene.add(cube);
        count += 1;
        createGUI(
            count,
            cube,
            adjustable_values,
            adjustable_walls,
            house_width,
            house_depth
        );
    });
}

function createGUI(
    count,
    cube,
    adjustable_values,
    adjustable_walls,
    house_width,
    house_depth
) {
    const elememt_id = "my-gui-container-".concat(count.toString());
    const gui_id = "gui-".concat(count.toString());

    // Create a new GUI
    var gui = new GUI({ autoPlace: false });
    gui.domElement.id = gui_id;
    var customContainer = document.getElementById(elememt_id);
    customContainer.appendChild(gui.domElement);

    var box3 = new THREE.Box3().setFromObject(cube);
    var size = new THREE.Vector3();
    box3.getSize(size);

    // Dimensions
    var width_box = size.x;
    var height_box = size.y;
    var depth_box = size.z;

    // Adjustable depths
    var min_depth = adjustable_values["Min Depth"] || 2.0;
    var max_pd_d = adjustable_values["Max PD D "] || 3.0;
    var max_pp_d = adjustable_values["Max PP D "] || 6.0;
    var min_width = adjustable_values["Min Width"] || 1.5;
    var max_pd_w = adjustable_values["Max PD W "] || 3.0;
    var max_pp_w = adjustable_values["Max PP W"] || 6.0;
    var min_height = adjustable_values["Min Height"] || 2.5;
    var max_pd_h = adjustable_values["Max PD H "] || 3.0;
    var max_pp_h = adjustable_values["Max PP H "] || 3.0;

    // Vertices
    var positions = cube.geometry.attributes.position;
    var boundary = {
        ixl: positions.array[0],
        ixr: positions.array[0] - width_box,
        iyb: positions.array[2],
        iyt: positions.array[2] + depth_box,
        izh: positions.array[13],
    };

    // console.log("initialPositionsArray", positions.array);
    // Print out the vertices
    // console.log(
    //     "ixl",
    //     boundary.ixl,
    //     "ixr",
    //     boundary.ixr,
    //     "iyb",
    //     boundary.iyb,
    //     "iyt",
    //     boundary.iyt,
    //     "izh",
    //     boundary.izh
    // );
    // for (let i = 0; i < positions.count; i++) {
    //     let x = positions.getX(i);
    //     let y = positions.getY(i);
    //     let z = positions.getZ(i);
    //     console.log(`Vertex ${i}: X = ${x}, Y = ${y}, Z = ${z}`);
    // }

    // Create an object for the cube's dimensions
    var cubeDimensions = {
        Width: width_box,
        Depth: depth_box,
        Height: height_box,
        color1: "#00ff00",
        color2: "#ffa500",
        color3: "#ff0000",
        Position: positions,
        H_Offset: 0,
        V_Offset: 0,
    };

    // Get initial position
    var initialPosition = new THREE.Vector3(
        positions.getX(0),
        positions.getY(0),
        positions.getZ(0)
    );

    CubeUpdater.initialCube(cube, cubeDimensions, initialPosition);

    // Add sliders to the GUI
    // Slider cases

    if (adjustable_walls.back && adjustable_walls.front) {
        console.log("back and front: Pinch Vertically Slider");
        console.log("and vertical position slider");
    }
    if (adjustable_walls.back && !adjustable_walls.front) {
        console.log("back only: Depth Slider to Rear");
        console.log("depths:", min_depth, max_pd_d, max_pp_d);
        gui.add(cubeDimensions, "Depth", min_depth, max_pp_d + 0.5).onChange(
            (Depth) =>
                CubeUpdater.updateCubeDepth(
                    cube,
                    { ...cubeDimensions, Depth },
                    initialPosition,
                    boundary,
                    min_depth,
                    max_pd_d,
                    max_pp_d
                )
        );
    }
    if (!adjustable_walls.back && adjustable_walls.front) {
        console.log("front only: Depth Slider to Front");
    }
    if (adjustable_walls.left && adjustable_walls.right) {
        console.log("left and right: Pinch Horizontally Slider");
        gui.add(cubeDimensions, "Width", house_width / 2, house_width).onChange(
            (Width) =>
                CubeUpdater.updateCubeWidthSqueeze(
                    cube,
                    { ...cubeDimensions, Width },
                    initialPosition,
                    boundary,
                    min_depth
                )
        );
        console.log("and horizontal position slider");
        gui.add(cubeDimensions, "H_Offset", 0.01, house_width / 2.0).onChange(
            (H_Offset) =>
                CubeUpdater.updateCubeWidthSlider(
                    cube,
                    { ...cubeDimensions, H_Offset },
                    initialPosition,
                    boundary
                )
        );
    }
    if (adjustable_walls.left && !adjustable_walls.right) {
        console.log("left only: Width Slider to Left");

        gui.add(cubeDimensions, "Width", min_width, max_pp_w + 0.5).onChange(
            (Width) =>
                CubeUpdater.updateCubeWidth(
                    cube,
                    { ...cubeDimensions, Width },
                    initialPosition,
                    boundary,
                    min_depth,
                    max_pd_w,
                    max_pp_w,
                    1
                )
        );
    }
    if (!adjustable_walls.left && adjustable_walls.right) {
        console.log("right only: Width Slider to Right");

        gui.add(cubeDimensions, "Width", min_width, max_pp_w + 0.5).onChange(
            (Width) =>
                CubeUpdater.updateCubeWidth(
                    cube,
                    { ...cubeDimensions, Width },
                    initialPosition,
                    boundary,
                    min_depth,
                    max_pd_w,
                    max_pp_w,
                    -1
                )
        );
    }

    // if (adjustable_walls.back || adjustable_walls.front) {
    //     gui.add(cubeDimensions, "Depth", 2, 7).onChange((Depth) =>
    //         CubeUpdater.updateCubeDepth(
    //             cube,
    //             { ...cubeDimensions, Depth },
    //             initialPosition,
    //             ext_type,
    //             adjustable_values,
    //             adjustable_walls,
    //             initialPositionsArray
    //         )
    //     );
    // }
    // if (adjustable_walls.left || adjustable_walls.right) {
    //     gui.add(cubeDimensions, "Width", 3, 6.5).onChange((Width) =>
    //         CubeUpdater.updateCubeWidth(
    //             cube,
    //             { ...cubeDimensions, Width },
    //             initialPosition,
    //             ext_type,
    //             adjustable_values,
    //             adjustable_walls,
    //             initialPositionsArray
    //         )
    //     );
    // }

    // if (adjustable_walls.up) {
    //     gui.add(cubeDimensions, "Height", 3, 6.5).onChange((Height) =>
    //         CubeUpdater.updateCubeHeight(
    //             cube,
    //             { ...cubeDimensions, Height },
    //             initialPosition,
    //             ext_type,
    //             adjustable_values,
    //             adjustable_walls,
    //             initialPositionsArray
    //         )
    //     );
    // }
    // gui.add(cubeDimensions, "Position", 3, 6.5).onChange((Position) =>
    //     CubeUpdater.updateCubePosition(
    //         cube,
    //         { ...cubeDimensions, Position },
    //         initialPosition,
    //         ext_type,
    //         adjustable_values,
    //         adjustable_walls,
    //         initialPositionsArray
    //     )
    // );
}
