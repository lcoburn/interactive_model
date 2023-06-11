import * as THREE from "https://cdn.skypack.dev/three@0.129.0";

export function updateCubeDepth(
    cube,
    cubeDimensions,
    oldDepth,
    initialPosition
) {
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
    let depthChange = cubeDimensions.depth - oldDepth;
    // cube.position.z += depthChange / 2.0;
    oldDepth = cubeDimensions.depth;
    cube.position.z += cubeDimensions.depth / 2.0;
    cube.position.x -= cubeDimensions.width / 2.0;
    cube.position.y += cubeDimensions.height / 2.0;

    if (cubeDimensions.depth <= 3.1) {
        cube.material.color.set(cubeDimensions.color1);
    } else if (cubeDimensions.depth <= 6.0) {
        cube.material.color.set(cubeDimensions.color2);
    } else {
        cube.material.color.set(cubeDimensions.color3);
    }
    return { cube, cubeDimensions, oldDepth, initialPosition };
}
