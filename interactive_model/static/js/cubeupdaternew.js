import * as THREE from "https://cdn.skypack.dev/three@0.129.0";

export let message = "Permissable under Permitted Development";

// load a texture
const texLoader = new THREE.TextureLoader();
// const texture = texLoader.load("../media/textures/brick-texture.png");

// CubeUpdater.js
export default class CubeUpdater {
    static initialCube(cube, cubeDimensions, initialPosition, name) {
        const temp_geomety = cube.geometry;
        cube.geometry.dispose();
        if (name != "1L" && name != "7L") {
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
            console.log(cube.material);
        } else {
            const material = new THREE.MeshLambertMaterial({
                color: cubeDimensions.color1, // or any color you prefer
                transparent: false,
                opacity: 1,
                side: THREE.DoubleSide,
            });
            // cube = new THREE.Mesh(temp_geomety, material);

            cube.material = material;
            cube.geometry = temp_geomety;
        }
        // cube.material.map = texture;
    }
    static updateCubeDepth(
        cube,
        cubeDimensions,
        initialPosition,
        boundary,
        min_depth,
        max_pd_d,
        max_pp_d,
        name,
        add_area
    ) {
        var oldArea = this.calculateBaseArea(cube);
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
        adjustableCasesMessages[currentKey][name] =
            CubeUpdater.setColorAndMessage(
                cube,
                cubeDimensions,
                cubeDimensions.Depth,
                max_pd_d,
                max_pp_d,
                add_area,
                oldArea,
                name
            );
    }

    static updateCubeWidth(
        cube,
        cubeDimensions,
        initialPosition,
        boundary,
        min_width,
        max_pd_w,
        max_pp_w,
        sign,
        name,
        add_area
    ) {
        console.log("******", sign);
        console.log(initialPosition);
        var oldArea = this.calculateBaseArea(cube);
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
        if (sign == -1) {
            cube.position.x += (sign * cubeDimensions.Width) / 2.0;
        } else {
            cube.position.x = -3 + cubeDimensions.Width / 2.0;
        }
        // if (sign == 1) {cube.position.x -= cubeDimensions.Width;}
        cube.position.y += cubeDimensions.Height / 2.0;
        console.log(cube.position);
        console.log(cube.position.x - cubeDimensions.Width);

        // set color by checking rules
        adjustableCasesMessages[currentKey][name] =
            CubeUpdater.setColorAndMessage(
                cube,
                cubeDimensions,
                cubeDimensions.Width,
                max_pd_w,
                max_pp_w,
                add_area,
                oldArea,
                name
            );
    }

    static updateCubeWidthSqueeze(
        cube,
        cubeDimensions,
        initialPosition,
        name,
        add_area
    ) {
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

    static updateCubeDepthSqueeze(
        cube,
        cubeDimensions,
        initialPosition,
        name,
        add_area
    ) {
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
        boundary,
        name
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
        boundary,
        name,
        add_area
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
        max_pp_h,
        min_width,
        min_depth,
        name,
        add_area
    ) {
        var oldArea = this.calculateBaseArea(cube);
        cube.geometry.dispose();
        if (cubeDimensions.Height > max_pd_h) {
            cubeDimensions.Height = max_pp_h;
            if (name == "4" || name == "5") {
                cubeDimensions.Depth = min_depth;
            } else if (name == "3" || name == "19") {
                cubeDimensions.Width = min_width;
            }
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
        adjustableCasesMessages[currentKey][name] =
            CubeUpdater.setColorAndMessage(
                cube,
                cubeDimensions,
                cubeDimensions.Height,
                max_pd_h,
                max_pp_h,
                add_area,
                oldArea,
                name
            );
    }

    static checkBreakRules(
        cube,
        cubeDimensions,
        sitesGeometry,
        add_area,
        oldArea
    ) {
        var break_rules = false;
        var message = "";
        if (!CubeUpdater.cubeVerticesInsidePolygon(cube, sitesGeometry.Main)) {
            break_rules = true;
            message = "Out of Bounds";
            cube.material.color.set(cubeDimensions.color3);
        } else if (!CubeUpdater.checkCurtilageArea(cube, add_area, oldArea)) {
            break_rules = true;
            message = "Extensions can not exceed 50% of the curtilage area";
            cube.material.color.set(cubeDimensions.color3);
        }
        return {
            message: message,
            break_rules: break_rules,
        };
    }

    static setColorAndMessage(
        cube,
        cubeDimensions,
        dist,
        max_pd,
        max_pp,
        add_area,
        oldArea,
        name
    ) {
        // var message = "";
        // var break_rules = false;
        var { message, break_rules } = CubeUpdater.checkBreakRules(
            cube,
            cubeDimensions,
            sitesGeometry,
            add_area,
            oldArea
        );
        if (!break_rules) {
            // set color by checking rules
            if (dist <= max_pd) {
                cube.material.color.set(cubeDimensions.color1);
                if (name == "4" || name == "5") {
                    message =
                        "Possible under Permitted Development or Prior Approval";
                } else {
                    message = "Possible under Permitted Development";
                }
            } else if (dist <= max_pp) {
                cube.material.color.set(cubeDimensions.color2);
                message = "Possible under Planning Permission";
            } else {
                cube.material.color.set(cubeDimensions.color3);
                message = "Most likely will not get permission";
            }
        }
        return message;
    }

    static cubeVerticesInsidePolygon(cube, polygon) {
        let vertices = []; // Array to store the vertices of the cube
        // let newPolygon = new Array(polygon[0].length).fill(0);
        let newPolygon = polygon[0].map((subArray) =>
            new Array(subArray.length).fill(0)
        );
        // loop through new polygon and change the first array eleemtns by negating them and then subtracting 2.89
        for (var i = 0; i < newPolygon[0].length; i++) {
            newPolygon[0][i] = -polygon[0][0][i] - 3;
            newPolygon[1][i] = polygon[0][1][i];
        }
        // site centre
        var siteCentre = this.getCentre(newPolygon);
        for (var i = 0; i < newPolygon[0].length; i++) {
            newPolygon[0][i] =
                (newPolygon[0][i] - siteCentre[0]) * 1.05 + siteCentre[0];
            newPolygon[1][i] =
                (newPolygon[1][i] - siteCentre[1]) * 1.05 + siteCentre[1];
        }

        // Assuming the cube's position is its center and it's aligned with the coordinate axes
        let halfWidth = cube.geometry.parameters.width / 2;
        let halfHeight = cube.geometry.parameters.height / 2;
        let halfDepth = cube.geometry.parameters.depth / 2;

        let x = cube.position.x;
        let y = cube.position.y;
        let z = cube.position.z;

        // Assuming you're checking the cube in the xy-plane, so z-coordinate is ignored
        vertices.push([x - halfWidth, z - halfDepth]); // bottom-left
        vertices.push([x + halfWidth, z - halfDepth]); // bottom-right
        vertices.push([x + halfWidth, z + halfDepth]); // top-right
        vertices.push([x - halfWidth, z + halfDepth]); // top-left
        // You can add the other 4 vertices if you're checking against a 3D polygon
        var isInside = true;
        for (let vertex of vertices) {
            if (!this.checkPointInPolygon(vertex, newPolygon)) {
                isInside = false; // If any vertex is outside the polygon, return false
            }
        }
        return isInside;
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

    static checkCurtilageArea(cube, add_area, oldArea) {
        var curtilage_area_check = true;

        // get new area
        let newArea = this.calculateBaseArea(cube);

        // update the total area
        add_area -= oldArea;
        add_area += newArea;

        if (add_area > 0.5 * curtilage_area) {
            curtilage_area_check = false;
        }
        return curtilage_area_check;
    }
    static calculateBaseArea(cube) {
        var box3 = new THREE.Box3().setFromObject(cube);
        var size = new THREE.Vector3();
        box3.getSize(size);
        var area = size.x * size.z;
        if (size.y > 5.0) {
            area *= 2;
        }
        return area;
    }
    // function to get the centre pf polygon
    static getCentre(polygon) {
        var siteCentre = [0, 0];
        for (var i = 0; i < polygon[0].length; i++) {
            siteCentre[0] += polygon[0][i];
            siteCentre[1] += polygon[1][i];
        }
        siteCentre[0] /= polygon[0].length;
        siteCentre[1] /= polygon[0].length;
        return siteCentre;
    }
}
