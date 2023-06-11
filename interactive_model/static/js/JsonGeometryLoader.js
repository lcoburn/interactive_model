import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
// import * as THREE from 'three';

export class JsonGeometryLoader {
    constructor(url) {
        this.url = url;
    }

    load() {
        return fetch(this.url)
        .then(response => response.json())
        .then(data => {
            return data.map(geoJson => this.createGeometry(geoJson));
        });
    }

    createGeometry(data) {
        const geometry = new THREE.BufferGeometry();

        const vertices = data.vertices.map(v => new THREE.Vector3(v.x - 3, v.y - 3, v.z - 3));
        const indices = data.indices;

        const vertexBufferAttribute = new THREE.BufferAttribute(new Float32Array(vertices.length * 3), 3);
        for (let i = 0; i < vertices.length; i++) {
            vertexBufferAttribute.setXYZ(i, vertices[i].x, vertices[i].y, vertices[i].z);
        }

        geometry.setAttribute('position', vertexBufferAttribute);
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }
}


// export class JsonGeometryLoader {
//     constructor(url) {
//         this.url = url;
//     }

//     load() {
//         return fetch(this.url)
//             .then(response => response.json())
//             .then(data => {
//                 return data.map(geoJson => this.createGeometry(geoJson))
//             });
//     }

//     createGeometry(data) {
//         const geometry = new THREE.BufferGeometry();

//         const vertices = data.vertices.map(v => new THREE.Vector3(v.x-3, v.y-3, v.z-3));
//         const indices = data.indices;

//         const vertexBufferAttribute = new THREE.BufferAttribute(new Float32Array(vertices.length * 3), 3);
//         for (let i = 0; i < vertices.length; i++) {
//             vertexBufferAttribute.setXYZ(i, vertices[i].x, vertices[i].y, vertices[i].z);
//         }

//         geometry.setAttribute('position', vertexBufferAttribute);
//         geometry.setIndex(indices);
//         geometry.computeVertexNormals();

//         return geometry;
//     }
// }
