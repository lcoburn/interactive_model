import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { gsap } from "https://cdn.skypack.dev/gsap@3.9.1";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { JsonGeometryLoader } from "./JsonGeometryLoader.js";
import { GUI } from "https://cdn.skypack.dev/dat.gui";
import CubeUpdater from "./cubeupdaternew.js";

// Set Local Authority
const localAuthorityValue = houseInfo.localAuthority;

// Select the element by its ID
// const localAuthorityElement = document.getElementById("local_authority");
// localAuthorityElement.textContent = localAuthorityValue;

// Event Listener for button click
document.addEventListener("DOMContentLoaded", (event) => {
    loadModel();
    const buttons = document.querySelectorAll(".load-model-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            loadModel();
            buttons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
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
    geometries.forEach((geometryTemp) => {
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
        height: 0.46 * width,
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
        2000
    );
    camera.position.z = 25;
    camera.position.x = 4;
    camera.position.y = 15;
    camera.lookAt(centreX - 3, centreY - 3, centreZ - 3);
    scene.add(camera);

    // Renderer
    const canvas = document.querySelector(".webgl");
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(centreX - 3, centreY - 3, centreZ - 3); // Set the orbit target to the scene center
    controls.update();
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 5;

    // Resize
    window.addEventListener("resize", () => {
        // Update Sizes
        const newWidth = document.getElementById("model-container").clientWidth;
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
    let add_area = 0;
    let cost = 0;
    const bpsqm = houseInfo.bpsqm;
    // Variables for dimensions
    let count = 0;

    // clear text from extension dimensions
    clearExtensionDimensions();

    // remove existing GUI;
    document.getElementById("general-container-efc").innerHTML = "";

    adjustableGeometries.forEach((adjustableGeometry, index) => {
        var keys = Object.keys(adjustableCasesMessages[currentKey]);
        adjustableCasesMessages[currentKey][keys[index]] =
            "Possible under Permitted Development";

        let geometry = loader.createGeometry(adjustableGeometry);
        // Create a material
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            opacity: 1,
        });
        // Create a mesh with the geometry and material
        let cube = new THREE.Mesh(geometry, material);
        add_area += calculateBaseArea(cube);
    });
    adjustableGeometries.forEach((adjustableGeometry) => {
        let geometry = loader.createGeometry(adjustableGeometry);
        adjustable_values =
            adjustableCases[currentKey].geometry[count].adjustable_values;
        adjustable_walls =
            adjustableCases[currentKey].geometry[count].adjustable_walls;
        let name = adjustableCases[currentKey].case[count];
        let long_name = "";
        let short_name = "";
        if (name == "3" || name == "19") {
            short_name = "Side";
            long_name = "Side Extension";
        }
        if (name == "4" || name == "5") {
            short_name = "Rear";
            long_name = "Rear Extension";
            adjustableCasesMessages[currentKey][name] =
                "Possible under Permitted Development or Prior Approval";
        }
        if (name == "1L" || name == "7L") {
            short_name = "Hip to Gable";
            long_name = "Hip to Gable Loft Conversion";
        }
        if (name == "4L") {
            short_name = "Loft";
            long_name = "Loft Conversion";
        }

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
            house_depth,
            name,
            short_name,
            long_name,
            add_area,
            bpsqm
        );
        updateExtensionDimenions(long_name, count, cube, name);
    });
    updateAreaCostElements(add_area, bpsqm);
}

function createGUI(
    count,
    cube,
    adjustable_values,
    adjustable_walls,
    house_width,
    house_depth,
    name,
    short_name,
    long_name,
    add_area,
    bpsqm
) {
    const elememt_id = "my-gui-container-".concat(count.toString());
    const gui_id = "gui-".concat(count.toString());
    const title_id = "title-card-".concat(count.toString());

    // Create a card for the new GUI
    var inputElement = document.createElement("input");
    inputElement.setAttribute("class", "radio-efc");
    inputElement.setAttribute("type", "radio");
    inputElement.setAttribute("name", "card");
    inputElement.setAttribute("id", `card-${count}`);

    var labelElement = document.createElement("label");
    labelElement.setAttribute("class", "content-efc");
    labelElement.setAttribute("for", `card-${count}`);

    var h3Element = document.createElement("h3");
    h3Element.setAttribute("id", `title-card-${count}`);
    h3Element.setAttribute("class", "card-title-efc");

    var divElement = document.createElement("div");
    divElement.setAttribute("id", `my-gui-container-${count}`);
    divElement.setAttribute("class", "my-gui-container");

    labelElement.appendChild(h3Element);
    labelElement.appendChild(divElement);

    var containerElement = document.getElementById("general-container-efc");
    containerElement.appendChild(inputElement);
    containerElement.appendChild(labelElement);

    if (count == 1) {
        inputElement.setAttribute("checked", "checked");
    }

    // Create a new GUI
    var gui = new GUI({ autoPlace: false });
    gui.domElement.id = gui_id;

    document.getElementById(title_id).innerHTML = short_name;

    const buttons = document.querySelectorAll(".extension-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const allGuis = document.querySelectorAll(`[id^="gui"]`);
            allGuis.forEach((gui) => (gui.style = "display: none"));

            const id = button.id;
            const gui = document.getElementById("gui-" + id);
            gui.style = "display:block";

            buttons.forEach((btn) => {
                // gui.close();
                btn.classList.remove("active");
            });
            button.classList.add("active");
        });
    });

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
    var max_pd_d = adjustable_values["Max PD D "] || 6.0;
    var max_pp_d = adjustable_values["Max PP D "] || 8.0;
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

    // Create an object for the cube's dimensions
    var cubeDimensions = {
        Width: width_box,
        Depth: depth_box,
        Height: height_box,
        color1: "#00ff00",
        color2: "#ffa500",
        color3: "#ff0000",
        Position: positions,
        H_Offset: 0.0,
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
    // Increase Depth of Rear Block
    if (adjustable_walls.back && !adjustable_walls.front) {
        console.log("back only: Depth Slider to Rear");
        gui.add(cubeDimensions, "Depth", min_depth, max_pp_d + 0.5).onChange(
            (Depth) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeDepth(
                    cube,
                    { ...cubeDimensions, Depth },
                    initialPosition,
                    boundary,
                    min_depth,
                    max_pd_d,
                    max_pp_d,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
    }
    // Increase Depth of Front Block
    if (!adjustable_walls.back && adjustable_walls.front) {
        console.log("front only: Depth Slider to Front");
    }
    // Increase Width of Side Block (Left)
    if (adjustable_walls.left && !adjustable_walls.right) {
        console.log("left only: Width Slider to Left");

        gui.add(cubeDimensions, "Width", min_width, max_pp_w + 5).onChange(
            (Width) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeWidth(
                    cube,
                    { ...cubeDimensions, Width },
                    initialPosition,
                    boundary,
                    min_depth,
                    max_pd_w,
                    max_pp_w,
                    1,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
    }
    // Increase Width of Side Block (Right)
    if (!adjustable_walls.left && adjustable_walls.right) {
        console.log("right only: Width Slider to Right");
        gui.add(cubeDimensions, "Width", min_width, max_pp_w + 0.5).onChange(
            (Width) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeWidth(
                    cube,
                    { ...cubeDimensions, Width },
                    initialPosition,
                    boundary,
                    min_depth,
                    max_pd_w,
                    max_pp_w,
                    -1,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
    }
    // Increase Height of Block
    if (adjustable_walls.up) {
        var max_height = max_pd_h + 0.5;
        if (name == "4L") {
            max_height = max_pd_h + 0.1;
        }
        console.log("up only: Height Slider");
        gui.add(cubeDimensions, "Height", min_height, max_height).onChange(
            (Height) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeHeight(
                    cube,
                    { ...cubeDimensions, Height },
                    initialPosition,
                    min_height,
                    max_pd_h,
                    max_pp_h,
                    min_width,
                    min_depth,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
    }
    // Squeeze and Move Rear Block
    if (adjustable_walls.left && adjustable_walls.right) {
        console.log("left and right: Pinch Horizontally Slider");
        gui.add(cubeDimensions, "Width", house_width / 2, house_width).onChange(
            (Width) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeWidthSqueeze(
                    cube,
                    { ...cubeDimensions, Width },
                    initialPosition,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
        console.log("and horizontal position slider");
        gui.add(cubeDimensions, "H_Offset", 0.0, house_width / 2.0).onChange(
            (H_Offset) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeWidthSlider(
                    cube,
                    { ...cubeDimensions, H_Offset },
                    initialPosition,
                    boundary,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
    }
    // Squeeze and Move Side Block
    if (adjustable_walls.back && adjustable_walls.front) {
        console.log("back and front: Pinch Vertically Slider");
        gui.add(cubeDimensions, "Depth", house_depth / 2, house_depth).onChange(
            (Depth) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeDepthSqueeze(
                    cube,
                    { ...cubeDimensions, Depth },
                    initialPosition,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
        console.log("and vertical position slider");
        gui.add(cubeDimensions, "V_Offset", 0.0, house_depth / 2.0).onChange(
            (V_Offset) => {
                // get old area
                let oldArea = calculateBaseArea(cube);

                CubeUpdater.updateCubeDepthSlider(
                    cube,
                    { ...cubeDimensions, V_Offset },
                    initialPosition,
                    boundary,
                    name,
                    add_area
                );
                // get new area
                let newArea = calculateBaseArea(cube);

                // update the total area
                add_area -= oldArea;
                add_area += newArea;

                updateAreaCostElements(add_area, bpsqm);
                updateExtensionDimenions(long_name, count, cube, name);
            }
        );
    }
}

function calculateBaseArea(cube) {
    var box3 = new THREE.Box3().setFromObject(cube);
    var size = new THREE.Vector3();
    box3.getSize(size);
    var area = size.x * size.z;
    if (size.y > 5.0) {
        area *= 2;
    }
    return area;
}

function roundToPrecision(number, precision) {
    if (number < 100) {
        const rounded = Math.round(number * (1 / precision)) / (1 / precision);
        return Number.isInteger(rounded) ? rounded.toFixed(1) : rounded;
    } else {
        const factor = 1 / precision;
        return Math.round(number * factor) / factor;
    }
}

function updateAreaCostElements(add_area, bpsqm) {
    const text_color = "rgb(255,255,255)";
    const addAreaElement = document.getElementById("add_area");
    addAreaElement.textContent = roundToPrecision(add_area, 0.1);
    addAreaElement.style.fontWeight = "bold";
    addAreaElement.style.color = text_color; // changing text color to blue
    const costElement = document.getElementById("cost");
    costElement.textContent = "£" + roundToPrecision(add_area * bpsqm, 1000);
    costElement.style.color = text_color; // changing text color to blue
    const messageElement = document.getElementById("message");
    // messageElement.textContent = message;
    // messageElement.style.color = text_color; // changing text color to blue
    // const warningElement = document.getElementById("warning");
    // warningElement.textContent = warning;
}

function updateExtensionDimenions(long_name, count, cube, name) {
    var box3 = new THREE.Box3().setFromObject(cube);
    var size = new THREE.Vector3();
    box3.getSize(size);

    // Dimensions
    var width_box = roundToPrecision(size.x, 0.1);
    var height_box = roundToPrecision(size.y, 0.1);
    var depth_box = roundToPrecision(size.z, 0.1);
    const text_color = "rgb(255,255,255)";
    // Example usage - replace with your own content
    if (count == 1) {
        // Create the HTML structure with the desired styles
        const content1 = `
${long_name}:
<i>w:</i> ${width_box}m, <i>d:</i> ${depth_box}m, <i>h:</i> ${height_box}m<br>
Planning Notes: <strong>${adjustableCasesMessages[currentKey][name]}</strong><br><br>
`;
        const extension1Dims = document.querySelector(
            ".extension-1-dimensions"
        );
        extension1Dims.innerHTML = content1;

        if (content1.trim() === "") {
            extension1Dims.style.display = "none";
        } else {
            extension1Dims.innerHTML = content1;
            extension1Dims.style.color = text_color; // changing text color to blue
        }
    } else if (count == 2) {
        const content2 = `
        ${long_name}:
        <i>w:</i> ${width_box}m, <i>d:</i> ${depth_box}m, <i>h:</i> ${height_box}m<br>
        Planning Notes: <strong>${adjustableCasesMessages[currentKey][name]}</strong><br><br>
`;
        const extension2Dims = document.querySelector(
            ".extension-2-dimensions"
        );
        extension2Dims.innerHTML = content2;
        if (content2.trim() === "") {
            extension2Dims.style.display = "none";
        } else {
            extension2Dims.innerHTML = content2;
            extension2Dims.style.color = text_color; // changing text color to blue
        }
    } else if (count == 3) {
        const content3 = `
        ${long_name}:
        <i>w:</i> ${width_box}m, <i>d:</i> ${depth_box}m, <i>h:</i> ${height_box}m<br>
        Planning Notes: <strong>${adjustableCasesMessages[currentKey][name]}</strong><br><br>
`;
        const extension3Dims = document.querySelector(
            ".extension-3-dimensions"
        );
        extension3Dims.innerHTML = content3;
        if (content3.trim() === "") {
            extension3Dims.style.display = "none";
        } else {
            extension3Dims.innerHTML = content3;
            extension3Dims.style.color = text_color; // changing text color to blue
            extension3Dims.style.fontWeight = "bold";
        }
    }
}
function clearExtensionDimensions() {
    const extension1Dims = document.querySelector(".extension-1-dimensions");
    const extension2Dims = document.querySelector(".extension-2-dimensions");
    const extension3Dims = document.querySelector(".extension-3-dimensions");
    extension1Dims.innerHTML = "";
    extension2Dims.innerHTML = "";
    extension3Dims.innerHTML = "";
}

// function messageFromCubeColor(cube) {
//     let cubeColor = cube.material.color.getHexString();

//     let message = "";

//     if (cubeColor === "00ff00") {
//         // Green color
//         message = "Permissable under Permitted Development";
//     } else if (cubeColor === "ffa500") {
//         // Orange color
//         message = "Permissable under Prior Approval";
//     } else if (cubeColor === "ff0000") {
//         // Red color
//         message = "Not Permissable";
//     } else {
//         message = "No message"; // Default or fallback message
//     }

//     return message;
// }
