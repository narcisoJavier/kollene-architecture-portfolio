// Run: node museum-study-check.cjs
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ window: {}, console });
for (const asset of ['three.min.js', 'museum-study.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'dist', 'assets', asset), 'utf8'), context, { filename: asset });
}
const THREE = context.THREE;
const geometry = context.window.buildMuseumStudyGeometry(THREE);
assert.ok(geometry.verts.length > 0 && geometry.faces.length > 0 && geometry.edges.length > 0);
assert.equal(geometry.renderMode, 'solid-illustration');
assert.equal(geometry.meta.approximate, true);
assert.equal(geometry.meta.petals, 7);
assert.equal(geometry.meta.undulatingWings, 2);
assert.equal(geometry.meta.entranceSteps, 7);
assert.equal(geometry.meta.ringSegments, 16);
for (const vertex of geometry.verts) {
  assert.ok(vertex instanceof THREE.Vector3);
  assert.ok([vertex.x, vertex.y, vertex.z].every(Number.isFinite));
}
const validIndex = index => Number.isInteger(index) && index >= 0 && index < geometry.verts.length;
for (const face of geometry.faces) {
  assert.ok(face.indices.length >= 3 && face.indices.every(validIndex));
  assert.match(face.color, /^#[0-9a-f]{6}$/i);
  const [a, b, c] = face.indices.map(index => geometry.verts[index]);
  assert.ok(b.clone().sub(a).cross(c.clone().sub(a)).length() > 1e-10, 'Faces must have nonzero area.');
}
for (const edge of geometry.edges) {
  assert.ok(validIndex(edge.a) && validIndex(edge.b) && edge.a !== edge.b);
  assert.equal(edge.role, 'outline', 'The illustration must not invent structural-force roles.');
}
const groups = new Set(geometry.faces.map(face => face.group));
assert.equal([...groups].filter(group => /^petal-/.test(group)).length, 7);
assert.equal([...groups].filter(group => /^wing-/.test(group)).length, 2);
assert.equal(geometry.faces.filter(face => face.group === 'stairs').length, 14);
for (const wing of ['wing-left', 'wing-right']) {
  const walls = geometry.faces.filter(face => face.group === wing && face.color === '#e4decd');
  assert.equal(walls.length, 49, 'Each wing needs continuous sides and an end cap, without individual posts.');
  for (const wall of walls) {
    const heights = wall.indices.map(index => geometry.verts[index].y);
    assert.ok(Math.max(...heights) - Math.min(...heights) > 0.3, 'The cream side surfaces must extend toward the base.');
  }
}
assert.deepEqual(Array.from(geometry.labels, label => label.text), ['RADIAL ROOF', 'CURVED EXTENSION', 'ENTRANCE']);
geometry.labels.forEach(label => assert.ok(label.pos.length === 3 && label.pos.every(Number.isFinite)));
const minX = Math.min(...geometry.verts.map(vertex => vertex.x));
const maxX = Math.max(...geometry.verts.map(vertex => vertex.x));
const minY = Math.min(...geometry.verts.map(vertex => vertex.y));
assert.ok(Math.abs(maxX - minX - 4.35) < 1e-8);
assert.ok(geometry.groundY < minY && minY - geometry.groundY < 0.03);

// Check the recommended starting camera against both the existing desktop and narrow stage.
for (const [width, height, mobileScale] of [[720, 420, 1], [335, 390, 1.24]]) {
  const { yaw, pitch, distance, target } = geometry.meta.recommendedCamera;
  const radius = distance * mobileScale;
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
  camera.position.set(Math.cos(pitch) * Math.cos(yaw) * radius, Math.sin(pitch) * radius, Math.cos(pitch) * Math.sin(yaw) * radius);
  camera.lookAt(...target);
  camera.updateMatrixWorld();
  geometry.verts.forEach(vertex => {
    const projected = vertex.clone().project(camera);
    assert.ok(Math.abs(projected.x) < 0.96 && Math.abs(projected.y) < 0.96, `${width}px camera should keep the entire model in frame.`);
  });
}
console.log(`PASS: ${geometry.verts.length} finite THREE vertices, ${geometry.faces.length} colored faces, 7 radial petals, 2 continuous wings, descriptive labels, normalized scale, desktop/mobile camera fit.`);
