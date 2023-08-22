import * as THREE from "https://cdn.skypack.dev/three@0.129.0";

export let message = "Permissable under PD";

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

        // set color by checking rules
        var break_rules = false;
        if (break_rules) {
            cube.material.color.set(cubeDimensions.color3);
        } else {
            CubeUpdater.setColor(cube, cubeDimensions, max_pd_d, max_pp_d);
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

        // set color by checking rules
        var message = CubeUpdater.setColor(
            cube,
            cubeDimensions,
            max_pd_w,
            max_pp_w
        );
        return message;
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

    static updateCubeDepthSqueeze(cube, cubeDimensions, initialPosition) {
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
        let newXPosition =
            initialPosition.x -
            cubeDimensions.H_Offset -
            0.5 * cubeDimensions.Width;
        if (newXPosition < boundary.ixr + 0.5 * cubeDimensions.Width) {
            newXPosition = boundary.ixr + 0.5 * cubeDimensions.Width;
        }
        cube.position.setX(newXPosition);
    }

    static updateCubeDepthSlider(
        cube,
        cubeDimensions,
        initialPosition,
        boundary
    ) {
        // No need to dispose and recreate the geometry if the dimensions aren't changing
        // cube.geometry.dispose();

        // You might want to use the updated Width to slide the box, but I'm assuming
        // you have a mechanism (like a slider) that sets the cubeDimensions.Width to the desired position.
        let newZPosition =
            initialPosition.z +
            cubeDimensions.V_Offset +
            0.5 * cubeDimensions.Depth;
        if (newZPosition > boundary.iyt - 0.5 * cubeDimensions.Depth) {
            newZPosition = boundary.iyt - 0.5 * cubeDimensions.Depth;
        }
        cube.position.setZ(newZPosition);
    }

    static updateCubeHeight(
        cube,
        cubeDimensions,
        initialPosition,
        min_height,
        max_pd_h,
        max_pp_h
    ) {
        cube.geometry.dispose();

        if (cubeDimensions.Height > max_pd_h) {
            cubeDimensions.Height = max_pp_h;
        }
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

        // set color by checking rules
        CubeUpdater.setColor(cube, cubeDimensions, max_pd_h, max_pp_h);
    }

    static checkPointInPolygon(point, polygon) {
        let x = point[0],
            y = point[1];
        let inside = false;

        // Assuming polygon is an array of 2xn where
        // polygon[0] contains all x-coordinates and
        // polygon[1] contains all y-coordinates of the polygon vertices
        for (
            let i = 0, j = polygon[0].length - 1;
            i < polygon[0].length;
            j = i++
        ) {
            let xi = polygon[0][i],
                yi = polygon[1][i];
            let xj = polygon[0][j],
                yj = polygon[1][j];

            let intersect =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }

    static cubeVerticesInsidePolygon(cube, polygon) {
        let vertices = []; // Array to store the vertices of the cube

        // Assuming the cube's position is its center and it's aligned with the coordinate axes
        let halfWidth = cube.geometry.parameters.width / 2;
        let halfHeight = cube.geometry.parameters.height / 2;
        let halfDepth = cube.geometry.parameters.depth / 2;

        let x = cube.position.x;
        let y = cube.position.y;
        let z = cube.position.z;

        // Assuming you're checking the cube in the xy-plane, so z-coordinate is ignored
        vertices.push([x - halfWidth, y - halfHeight]); // bottom-left
        vertices.push([x + halfWidth, y - halfHeight]); // bottom-right
        vertices.push([x + halfWidth, y + halfHeight]); // top-right
        vertices.push([x - halfWidth, y + halfHeight]); // top-left
        // You can add the other 4 vertices if you're checking against a 3D polygon

        var isInside = true;
        for (let vertex of vertices) {
            if (!this.checkPointInPolygon(vertex, polygon)) {
                isInside = false; // If any vertex is outside the polygon, return false
            }
        }

        if (isInside) {
            globalMessage = "No warning";
        } else {
            globalMessage = "Out of bounds";
        }

        return globalMessage;
    }

    static checkBreakRules(cube, sitesGeometry) {
        console.log("checkBreakRules");
    }

    static setColor(cube, cubeDimensions, max_pd, max_pp) {
        // set color by checking rules
        if (cubeDimensions.Width <= max_pd) {
            cube.material.color.set(cubeDimensions.color1);
            message = "Permissable under PD";
        } else if (cubeDimensions.Width <= max_pp) {
            cube.material.color.set(cubeDimensions.color2);
            message = "Permissable under PP";
        } else {
            cube.material.color.set(cubeDimensions.color3);
            message = "Not Permissable";
        }
        return message;
    }
}
