(function () {
  'use strict';

  // Photo-informed illustration of Board 17; proportions and hidden geometry are approximate.
  window.buildMuseumStudyGeometry = function (THREE) {
    if (!THREE || typeof THREE.Vector3 !== 'function') throw new TypeError('Museum study requires THREE.Vector3.');
    const geometry = { verts: [], edges: [], faces: [], labels: [] };
    const vertexIds = new Map();
    const edgeIds = new Set();
    const TAU = Math.PI * 2;
    const brass = '#a28a5e';
    const baseY = -1;
    const floorY = -0.91;
    const roofY = -0.03;
    const polar = (radius, angle, y) => [Math.sin(angle) * radius, y, Math.cos(angle) * radius];

    function vertex(point) {
      const key = point.map(value => Math.round(value * 1e6)).join(',');
      if (!vertexIds.has(key)) {
        vertexIds.set(key, geometry.verts.length);
        geometry.verts.push(point);
      }
      return vertexIds.get(key);
    }

    function face(points, color, options = {}) {
      const indices = points.map(vertex);
      geometry.faces.push({ indices, color, ...options });
      if (options.stroke && options.stroke !== false) {
        indices.forEach((a, index) => {
          const b = indices[(index + 1) % indices.length];
          const key = [Math.min(a, b), Math.max(a, b)].join(',');
          if (edgeIds.has(key)) return;
          edgeIds.add(key);
          geometry.edges.push({ a, b, role: 'outline', color: options.stroke, width: options.width || 0.65, decorative: true });
        });
      }
    }

    function extrude(outline, bottom, color, roofColor, stroke, group) {
      const underside = outline.map(p => [p[0], bottom, p[2]]);
      outline.forEach((p, index) => {
        const next = (index + 1) % outline.length;
        face([underside[index], underside[next], outline[next], p], color, { stroke, width: 0.65, group });
      });
      face(outline, roofColor, { stroke, width: 0.85, shadow: true, group });
    }

    const lawn = [
      [-1.58, baseY + 0.035, -1.61], [1.58, baseY + 0.035, -1.61],
      [1.95, baseY + 0.035, -0.95], [1.73, baseY + 0.035, 0.34],
      [1.32, baseY + 0.035, 1.55], [0.55, baseY + 0.035, 1.73],
      [0, baseY + 0.035, 1.62], [-0.55, baseY + 0.035, 1.73],
      [-1.32, baseY + 0.035, 1.55], [-1.73, baseY + 0.035, 0.34],
      [-1.95, baseY + 0.035, -0.95]
    ];
    const plinth = lawn.map(p => [p[0] * 1.085, baseY, p[2] * 1.085]);
    extrude(plinth, baseY - 0.065, '#d8d8cc', '#e9e7dd', '#c6c6b7', 'plinth');
    face(lawn, '#73835c', { stroke: '#65754f', flat: true, width: 0.7, group: 'landscape' });
    for (let i = 0; i < 30; i++) {
      const p = polar(1.53 + (i % 4) * 0.075, i * 2.39996, baseY + 0.041);
      const size = 0.025 + (i % 3) * 0.012;
      face([[p[0] - size, p[1], p[2]], [p[0], p[1], p[2] + size], [p[0] + size, p[1], p[2]]], i % 2 ? '#82916a' : '#62754e', { flat: true, stroke: false, group: 'landscape' });
    }

    const gap = 0.54;
    const step = (TAU - gap) / 7;
    for (let i = 0; i < 7; i++) {
      const angle = gap / 2 + (i + 0.5) * step;
      const half = step / 2 - 0.006;
      const outline = [
        polar(0.39, angle - half * 0.95, roofY + 0.10),
        polar(1.45, angle - half, roofY),
        polar(1.69, angle, roofY + 0.035),
        polar(1.45, angle + half, roofY),
        polar(0.39, angle + half * 0.95, roofY + 0.10)
      ];
      extrude(outline, floorY, '#e2dfd3', '#f5f2e9', brass, `petal-${i + 1}`);
      face([
        polar(0.40, angle + half, roofY + 0.105),
        polar(1.44, angle + half, roofY + 0.005),
        polar(1.44, angle + half + 0.015, roofY + 0.005),
        polar(0.40, angle + half + 0.015, roofY + 0.105)
      ], '#60665d', { flat: true, stroke: false, group: 'radial-seams' });
    }

    const ringSegments = 16;
    for (let i = 0; i < ringSegments; i++) {
      const a = i / ringSegments * TAU;
      const b = (i + 1) / ringSegments * TAU;
      face([polar(0.36, a, -0.01), polar(0.36, b, -0.01), polar(0.23, b, 0.28), polar(0.23, a, 0.28)], i % 2 ? '#a7ada4' : '#cbd0c6', { stroke: '#768075', width: 0.65, group: 'center' });
      face([polar(0.245, a, 0.28), polar(0.245, b, 0.28), polar(0.245, b, 0.36), polar(0.245, a, 0.36)], '#dbd5bf', { stroke: brass, width: 0.7, group: 'ring' });
      face([polar(0.245, a, 0.36), polar(0.245, b, 0.36), polar(0.173, b, 0.36), polar(0.173, a, 0.36)], '#f4eee0', { stroke: brass, width: 0.55, group: 'ring' });
    }
    face(Array.from({ length: ringSegments }, (_, i) => polar(0.173, i / ringSegments * TAU, 0.285)), '#626c61', { flat: true, stroke: false, group: 'center' });

    face([[-0.23, -0.52, 0.52], [0.23, -0.52, 0.52], [0.23, -0.10, 0.52], [-0.23, -0.10, 0.52]], '#73796e', { stroke: brass, group: 'entrance' });
    for (let i = 0; i < 7; i++) {
      const z0 = 0.58 + i * 0.145;
      const z1 = z0 + 0.145;
      const w0 = 0.19 + i * 0.031;
      const w1 = w0 + 0.031;
      const y = -0.47 - i * 0.071;
      face([[-w0, y, z0], [w0, y, z0], [w1, y, z1], [-w1, y, z1]], '#e4e2d7', { stroke: '#aaa995', width: 0.7, shadow: true, group: 'stairs' });
      face([[-w1, y, z1], [w1, y, z1], [w1, y - 0.071, z1], [-w1, y - 0.071, z1]], '#c9cbbf', { stroke: '#aaa995', width: 0.65, group: 'stairs' });
    }

    [-1, 1].forEach(side => {
      const strips = [];
      const segments = 24;
      const group = side < 0 ? 'wing-left' : 'wing-right';
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = side * (1.38 + t * 3.35);
        const center = -0.08 + Math.sin(t * Math.PI * 2.2 + (side < 0 ? 0.55 : 0)) * 0.17;
        const halfWidth = (0.35 + Math.sin(t * Math.PI * 4.4) * 0.07) * (1 - 0.40 * t);
        const y = -0.19 - t * 0.055;
        strips.push({ back: [x, y, center - halfWidth], front: [x, y, center + halfWidth] });
      }
      for (let i = 0; i < segments; i++) {
        const a = strips[i], b = strips[i + 1];
        face([a.back, b.back, b.front, a.front], '#f0ebdb', { stroke: false, shadow: true, group });
        ['back', 'front'].forEach(edge => {
          const p = a[edge], q = b[edge];
          // Continuous cream walls reach the base; no individual supports are inferred.
          face([p, q, [q[0], baseY + 0.05, q[2]], [p[0], baseY + 0.05, p[2]]], '#e4decd', { stroke: false, group });
          face([p, q, [q[0], q[1] - 0.014, q[2]], [p[0], p[1] - 0.014, p[2]]], brass, { stroke: false, flat: true, group });
        });
      }
      const end = strips[segments];
      face([end.back, end.front, [end.front[0], baseY + 0.05, end.front[2]], [end.back[0], baseY + 0.05, end.back[2]]], '#e4decd', { stroke: false, group });
    });

    const rawBounds = {
      min: [0, 1, 2].map(axis => Math.min(...geometry.verts.map(p => p[axis]))),
      max: [0, 1, 2].map(axis => Math.max(...geometry.verts.map(p => p[axis])))
    };
    const center = rawBounds.min.map((value, axis) => (value + rawBounds.max[axis]) / 2);
    const scale = 4.35 / (rawBounds.max[0] - rawBounds.min[0]);
    const normalize = p => [(p[0] - center[0]) * scale, (p[1] - center[1]) * scale - 0.1, (p[2] - center[2]) * scale];
    geometry.verts = geometry.verts.map(p => new THREE.Vector3(...normalize(p)));
    geometry.labels = [
      { pos: normalize(polar(1.25, 3.8, 0.12)), text: 'RADIAL ROOF' },
      { pos: normalize([3.10, -0.13, 0]), text: 'CURVED EXTENSION' },
      { pos: normalize([0, -0.38, 1.25]), text: 'ENTRANCE' }
    ];
    geometry.groundY = Math.min(...geometry.verts.map(v => v.y)) - 0.025;
    geometry.renderMode = 'solid-illustration';
    geometry.meta = {
      approximate: true,
      source: 'Board 17 physical-model photographs',
      petals: 7, undulatingWings: 2, entranceSteps: 7, ringSegments,
      scale, normalizedWidth: 4.35,
      recommendedCamera: { yaw: 1.38, pitch: 0.88, distance: 7.4, target: [0, -0.1, 0] }
    };
    return geometry;
  };
})();
