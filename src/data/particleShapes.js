// Character particles sample the supplied reference images; VR and coding use vector masks.
const WHITE = '#d7e9f5';
const TEAL = '#55e4ce';
const BLUE = '#7a9bea';
const PINK = '#f18bae';
const DARK = '#385368';

function path(ctx, d, fill, stroke, width = 2) {
  const shape = new Path2D(d);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(shape);
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke(shape);
  }
}

function vr(ctx) {
  path(ctx, 'M204 223 C184 109 416 109 396 223', null, BLUE, 18);
  path(ctx, 'M227 213 C219 144 381 144 373 213', null, WHITE, 3);
  path(ctx, 'M179 220 L143 232 L143 287 L180 297 M421 220 L457 232 L457 287 L420 297', null, TEAL, 8);
  path(ctx, 'M187 195 Q300 178 413 195 Q433 199 434 225 L425 292 Q422 319 395 321 L338 318 L319 302 L281 302 L262 318 L205 321 Q178 319 175 292 L166 225 Q167 199 187 195 Z', '#94b6d1', WHITE, 4);
  path(ctx, 'M199 215 Q300 201 401 215 Q413 218 411 237 L406 282 Q404 295 386 296 L337 292 L319 281 L281 281 L263 292 L214 296 Q196 295 194 282 L189 237 Q187 218 199 215 Z', '#1e384d', TEAL, 3);
  path(ctx, 'M211 231 Q300 214 390 231', null, '#a0eade', 3);
  path(ctx, 'M212 268 L221 268 M379 268 L388 268 M288 316 Q300 327 312 316', null, WHITE, 5);
  path(ctx, 'M202 378 C139 368 129 323 159 321 C189 320 228 358 202 378 Z M398 378 C461 368 471 323 441 321 C411 320 372 358 398 378 Z', null, TEAL, 6);
  path(ctx, 'M179 355 L214 391 Q223 415 206 418 L169 379 Z M421 355 L386 391 Q377 415 394 418 L431 379 Z', BLUE, WHITE, 3);
  path(ctx, 'M246 362 L300 390 L354 362 M246 379 L300 407 L354 379', null, DARK, 2);
}

function coding(ctx) {
  path(ctx, 'M143 126 L457 126 Q468 126 468 138 L468 340 L132 340 L132 138 Q132 126 143 126 Z', '#263e56', BLUE, 3);
  path(ctx, 'M149 164 L451 164 L451 320 L149 320 Z', '#142a3d', TEAL, 2);
  path(ctx, 'M150 145 L156 145 M169 145 L175 145 M188 145 L194 145', null, PINK, 5);
  path(ctx, 'M213 218 L183 243 L213 268 M387 218 L417 243 L387 268 M323 196 L280 287', null, TEAL, 9);
  path(ctx, 'M249 220 L260 220 M245 246 L256 246 M337 246 L348 246 M332 271 L343 271', null, WHITE, 4);
  path(ctx, 'M132 340 L94 391 Q92 403 113 403 L487 403 Q508 403 506 391 L468 340 Z', '#52718c', WHITE, 3);
  path(ctx, 'M148 354 L452 354 L471 380 L129 380 Z', '#203c4c', BLUE);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 15; col += 1) {
      ctx.fillStyle = col % 3 ? '#8fbcce' : TEAL;
      ctx.fillRect(148 + col * 20 - row * 3, 355 + row * 8, 12, 3);
    }
  }
  path(ctx, 'M271 385 L329 385 L336 395 L264 395 Z', BLUE);
  path(ctx, 'M109 191 L90 203 L109 215 M491 277 L510 289 L491 301 M463 96 L478 81 M477 105 L494 99', null, BLUE, 3);
}

export const particleScenes = [
  { id: 'gundam', image: '/images/particles/gundam-reference.png' },
  { id: 'miku', image: '/images/particles/miku-reference.png' },
  { id: 'vr', draw: vr },
  { id: 'coding', draw: coding },
];

const referenceCache = new Map();

function loadReference(src) {
  if (!referenceCache.has(src)) {
    const image = new Image();
    image.src = src;
    const pending = image.decode().then(() => image).catch((error) => {
      referenceCache.delete(src);
      throw error;
    });
    referenceCache.set(src, pending);
  }
  return referenceCache.get(src);
}

function referencePixels(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas is unavailable');
  ctx.drawImage(image, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let left = canvas.width;
  let top = canvas.height;
  let right = 0;
  let bottom = 0;
  // Crop transparent padding only. Dark sleeves, outlines and boots remain intact.
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      if (data[(y * canvas.width + x) * 4 + 3] > 100) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (left > right || top > bottom) throw new Error('Reference image is empty');
  return { image, left, top, width: right - left + 1, height: bottom - top + 1 };
}

export async function sampleParticleShapes(count) {
  const references = await Promise.all(particleScenes.map(async (scene) => (
    scene.image ? referencePixels(await loadReference(scene.image)) : null
  )));
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas is unavailable');

  let seed = 39;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  return particleScenes.map((scene, index) => {
    ctx.clearRect(0, 0, 600, 600);
    const reference = references[index];
    if (reference) {
      const ratio = Math.min(500 / reference.width, 510 / reference.height);
      const width = reference.width * ratio;
      const height = reference.height * ratio;
      ctx.drawImage(reference.image, reference.left, reference.top, reference.width, reference.height,
        (600 - width) / 2, (600 - height) / 2, width, height);
    } else {
      ctx.save();
      ctx.translate(0, 50);
      scene.draw(ctx);
      ctx.restore();
    }

    const { data } = ctx.getImageData(0, 0, 600, 600);
    const candidates = [];
    for (let y = 20; y < 580; y += 1) {
      for (let x = 20; x < 580; x += 1) {
        const offset = (y * 600 + x) * 4;
        if (data[offset + 3] <= 100) continue;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        // Give near-white particles enough contrast on the site's light background.
        const shade = Math.max(0, Math.min(r, g, b) - 115) * 0.6;
        const edge = Math.abs(r - data[offset + 4])
          + Math.abs(g - data[offset + 5])
          + Math.abs(b - data[offset + 6]);
        // Prefer boundaries and the upper portrait so faces and thin antennae survive sampling.
        const weight = 0.55 + Math.min(edge / 160, 0.85) + (reference && y < 175 ? 0.6 : 0);
        candidates.push({
          x: x - 300, y: y - 300,
          r: r - shade, g: g - shade, b: b - shade,
          priority: -Math.log(Math.max(random(), 0.000001)) / weight,
        });
      }
    }
    if (!candidates.length) throw new Error(`No particles for ${scene.id}`);
    candidates.sort((a, b) => a.priority - b.priority);
    const selected = candidates.slice(0, Math.min(count, candidates.length));
    // Randomize correspondence to produce a cloud during every scene transition.
    for (let i = selected.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }
    return Array.from({ length: count }, (_, i) => {
      const { x, y, r, g, b } = selected[i % selected.length];
      return { x, y, r, g, b };
    });
  });
}

