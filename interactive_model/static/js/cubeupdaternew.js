import * as THREE from "https://cdn.skypack.dev/three@0.129.0";

// CubeUpdater.js
export default class CubeUpdater {
    static initialCube(cube, cubeDimensions, initialPosition) {
        cube.geometry.dispose();

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.Width,
            cubeDimensions.Height,
            cubeDimensions.Depth
        ); // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        cube.position.z += cubeDimensions.Depth / 2.0;
        cube.position.x -= cubeDimensions.Width / 2.0;
        cube.position.y += cubeDimensions.Height / 2.0;
        cube.material.color.set(cubeDimensions.color1);
    }
    static updateCubeDepth(
        cube,
        cubeDimensions,
        initialPosition,
        boundary,
        min_depth,
        max_pd_d,
        max_pp_d
    ) {
        cube.geometry.dispose();

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.Width,
            cubeDimensions.Height,
            cubeDimensions.Depth
        ); // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        cube.position.z += cubeDimensions.Depth / 2.0;
        cube.position.x -= cubeDimensions.Width / 2.0;
        cube.position.y += cubeDimensions.Height / 2.0;
        if (cubeDimensions.Depth <= max_pd_d) {
            cube.material.color.set(cubeDimensions.color1);
        } else if (cubeDimensions.Depth <= max_pp_d) {
            cube.material.color.set(cubeDimensions.color2);
        } else {
            cube.material.color.set(cubeDimensions.color3);
        }
    }

    static updateCubeWidth(
        cube,
        cubeDimensions,
        initialPosition,
        boundary,
        min_width,
        max_pd_w,
        max_pp_w,
        sign
    ) {
        cube.geometry.dispose();

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.Width,
            cubeDimensions.Height,
            cubeDimensions.Depth
        );

        // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        cube.position.z += cubeDimensions.Depth / 2.0;
        cube.position.x += (sign * cubeDimensions.Width) / 2.0;
        cube.position.y += cubeDimensions.Height / 2.0;
        if (cubeDimensions.Width <= max_pd_w) {
            cube.material.color.set(cubeDimensions.color1);
        } else if (cubeDimensions.Width <= max_pp_w) {
            cube.material.color.set(cubeDimensions.color2);
        } else {
            cube.material.color.set(cubeDimensions.color3);
        }
    }

    static updateCubeWidthSqueeze(cube, cubeDimensions, initialPosition) {
        cube.geometry.dispose();

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.Width,
            cubeDimensions.Height,
            cubeDimensions.Depth
        );

        // set new geometry
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // Keep center static; only adjust for depth and height
        cube.position.y += cubeDimensions.Height / 2.0;
        cube.position.z += cubeDimensions.Depth / 2.0;
        cube.position.x -= cubeDimensions.Width / 2.0;
    }

    static updateCubeWidthSlider(
        cube,
        cubeDimensions,
        initialPosition,
        boundary
    ) {
        // No need to dispose and recreate the geometry if the dimensions aren't changing
        // cube.geometry.dispose();

        // You might want to use the updated Width to slide the box, but I'm assuming
        // you have a mechanism (like a slider) that sets the cubeDimensions.Width to the desired position.

        let newXPosition = initialPosition.x - cubeDimensions.H_Offset;

        // Ensure the cube's position doesn't exceed the boundaries
        if (newXPosition < boundary.ixl) {
            newXPosition = boundary.ixl;
            cube.position.setX(newXPosition);
            cube.position.x -=
                cubeDimensions.H_Offset - (1 * cubeDimensions.Width) / 2.0;
        } else if (newXPosition - cubeDimensions.Width > boundary.ixr) {
            newXPosition = boundary.ixr - cubeDimensions.Width;
            cube.position.setX(newXPosition);
            cube.position.x -=
                cubeDimensions.H_Offset + 0 * cubeDimensions.Width;
        }

        // Keep center static; only adjust for depth and height
        // cube.position.y += cubeDimensions.Height / 2.0;
        // cube.position.z += cubeDimensions.Depth / 2.0;

        // Assuming max_pd_w and max_pp_w are accessible in this scope
        // if (cubeDimensions.Width <= max_pd_w) {
        //     cube.material.color.set(cubeDimensions.color1);
        // } else if (cubeDimensions.Width <= max_pp_w) {
        //     cube.material.color.set(cubeDimensions.color2);
        // } else {
        //     cube.material.color.set(cubeDimensions.color3);
        // }
    }

    static updateCubeHeight(cube, cubeDimensions, initialPosition) {
        cube.geometry.dispose();

        // create new geometry
        let newGeometry = new THREE.BoxGeometry(
            cubeDimensions.Width,
            cubeDimensions.Height,
            cubeDimensions.Depth
        ); // adjust width and height as per your requirements
        cube.geometry = newGeometry;
        cube.position.copy(initialPosition);

        // adjust cube's position so that front face stays at the same place
        cube.position.z += cubeDimensions.Depth / 2.0;
        cube.position.x -= cubeDimensions.Width / 2.0;
        cube.position.y += cubeDimensions.Height / 2.0;

        if (cubeDimensions.Height <= 2.8) {
            cube.material.color.set(cubeDimensions.color1);
        } else {
            cube.material.color.set(cubeDimensions.color3);
        }
    }
    // static updateCubePosition(cube, cubeDimensions, initialPosition) {
    //     cube.geometry.dispose();

    //     // create new geometry
    //     let newGeometry = new THREE.BoxGeometry(
    //         cubeDimensions.Width,
    //         cubeDimensions.Height,
    //         cubeDimensions.Depth
    //     ); // adjust width and height as per your requirements
    //     cube.geometry = newGeometry;
    //     cube.position.copy(initialPosition);

    //     // adjust cube's position so that front face stays at the same place
    //     cube.position.z += cubeDimensions.Depth / 2.0;
    //     cube.position.x -= cubeDimensions.Width / 2.0;
    //     cube.position.y += cubeDimensions.Height / 2.0;

    //     if (cubeDimensions.Height <= 2.8) {
    //         cube.material.color.set(cubeDimensions.color1);
    //     } else {
    //         cube.material.color.set(cubeDimensions.color3);
    //     }
    // }

    // add as many updateCube methods as you need...
}
