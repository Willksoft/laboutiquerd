const fs = require('fs');

function parseGLB(filename) {
    const glbBuffer = fs.readFileSync(filename);
    const magic = glbBuffer.readUInt32LE(0);
    if (magic !== 0x46546C67) { console.error("Not a GLB"); return; }
    const version = glbBuffer.readUInt32LE(4);
    const length = glbBuffer.readUInt32LE(8);

    let jsonChunkLength = glbBuffer.readUInt32LE(12);
    let jsonChunkType = glbBuffer.readUInt32LE(16);
    if (jsonChunkType !== 0x4E4F534A) { console.error("Not JSON"); return; }
    
    let jsonBuffer = glbBuffer.slice(20, 20 + jsonChunkLength);
    let jsonString = jsonBuffer.toString('utf8');
    let gltf = JSON.parse(jsonString);
    console.log("Nodes:");
    gltf.nodes.forEach((n, i) => console.log(i, n.name, "mesh:", n.mesh));
    console.log("Meshes:");
    if (gltf.meshes) gltf.meshes.forEach((m, i) => console.log(i, m.name));
    console.log("Materials:");
    if (gltf.materials) gltf.materials.forEach((m, i) => console.log(i, m.name));
}

parseGLB('public/shirt_baked.glb');
