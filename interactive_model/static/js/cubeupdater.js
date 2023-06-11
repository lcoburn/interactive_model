import * as THREE from "https://cdn.skypack.dev/three@0.129.0";

// CubeUpdater.js
export default class CubeUpdater {
    static updateCubeDepth(cube, cubeDimensions, initialPosition, ext_type) {
        cube.geometry.dispose();

        var sign = 1;
        if (ext_type == "rear") {
            sign = -1;
        }
        if (ext_type == "left_side") {
            sign = 1;
        }

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.width,
            cubeDimensions.height,
            cubeDimensions.depth
        ); // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        cube.position.z += cubeDimensions.depth / 2.0;
        cube.position.x += (sign * cubeDimensions.width) / 2.0;
        cube.position.y += cubeDimensions.height / 2.0;
        if (ext_type == "rear") {
            if (cubeDimensions.depth <= 3.1) {
                cube.material.color.set(cubeDimensions.color1);
            } else if (cubeDimensions.depth <= 6.0) {
                cube.material.color.set(cubeDimensions.color2);
            } else {
                cube.material.color.set(cubeDimensions.color3);
            }
        }
    }

    static updateCubeWidth(cube, cubeDimensions, initialPosition, ext_type) {
        cube.geometry.dispose();
        var sign = 1;
        if (ext_type == "rear") {
            sign = -1;
        }
        if (ext_type == "left_side") {
            sign = 1;
        }

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.width,
            cubeDimensions.height,
            cubeDimensions.depth
        );

        // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        cube.position.z += cubeDimensions.depth / 2.0;
        cube.position.x += (sign * cubeDimensions.width) / 2.0;
        cube.position.y += cubeDimensions.height / 2.0;
        if (ext_type == "left_side") {
            if (cubeDimensions.width <= 2.2) {
                cube.material.color.set(cubeDimensions.color1);
            } else {
                cube.material.color.set(cubeDimensions.color3);
            }
        }
    }

    static updateCubeHeight(cube, cubeDimensions, initialPosition) {
        cube.geometry.dispose();

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.width,
            cubeDimensions.height,
            cubeDimensions.depth
        ); // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        cube.position.z += cubeDimensions.depth / 2.0;
        cube.position.x -= cubeDimensions.width / 2.0;
        cube.position.y += cubeDimensions.height / 2.0;

        if (cubeDimensions.height <= 2.8) {
            cube.material.color.set(cubeDimensions.color1);
        } else {
            cube.material.color.set(cubeDimensions.color3);
        }
    }

    // add as many updateCube methods as you need...
}
