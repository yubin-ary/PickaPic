import { Image } from 'react-native-canvas';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

const HASH_WIDTH = 64;
const HASH_HEIGHT = 64;

const stripFileScheme = path => {
  if (!path) return path;
  if (path.startsWith('ph://')) {
    return path.slice(5);
  }
  if (path.startsWith('file://')) {
    return path.slice(7);
  }
  return path;
};

const resolveCanvasSrc = async uri => {
  if (uri.startsWith('data:')) {
    return uri;
  }

  const resized = await ImageResizer.createResizedImage(
    uri,
    HASH_WIDTH,
    HASH_HEIGHT,
    'PNG',
    100,
  );
  const path = resized?.path || resized?.uri || uri;
  if (!path) return uri;

  try {
    const base64 = await RNFS.readFile(stripFileScheme(path), 'base64');
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.log('readFile error', err);
    return uri;
  }
};

const getLuma = data => {
  const luma = [];
  for (let i = 0; i + 3 < data.length; i += 4) {
    const R = 0.299 * Number(data[i]);
    const G = 0.586 * Number(data[i + 1]);
    const B = 0.114 * Number(data[i + 2]);
    luma.push(R + G + B);
  }
  return luma;
};
const edgeify = luma => {
  if (!Array.isArray(luma) || luma.length !== HASH_WIDTH * HASH_HEIGHT) {
    return luma;
  }
  const edges = new Array(luma.length).fill(0);
  let max = 0;
  for (let y = 1; y < HASH_HEIGHT - 1; y++) {
    for (let x = 1; x < HASH_WIDTH - 1; x++) {
      const idx = y * HASH_WIDTH + x;
      const tl = luma[idx - HASH_WIDTH - 1];
      const tc = luma[idx - HASH_WIDTH];
      const tr = luma[idx - HASH_WIDTH + 1];
      const ml = luma[idx - 1];
      const mr = luma[idx + 1];
      const bl = luma[idx + HASH_WIDTH - 1];
      const bc = luma[idx + HASH_WIDTH];
      const br = luma[idx + HASH_WIDTH + 1];

      const gx = -tl + tr + -2 * ml + 2 * mr + -bl + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
      const mag = Math.sqrt(gx * gx + gy * gy);
      edges[idx] = mag;
      if (mag > max) max = mag;
    }
  }
  if (max === 0) return edges;
  for (let i = 0; i < edges.length; i++) {
    edges[i] = (edges[i] / max) * 255;
  }
  return edges;
};
const threshold = (luma, value = 64) => {
  if (!Array.isArray(luma)) return luma;
  return luma.map(v => (v >= value ? 255 : 0));
};
const normalizeStrokes = async (canvas, strokes, size) => {
  if (!canvas || typeof canvas.getContext !== 'function') return [];
  if (!size?.width || !size?.height) return [];
  if (!Array.isArray(strokes) || strokes.length === 0) return [];

  canvas.width = HASH_WIDTH;
  canvas.height = HASH_HEIGHT;
  const ctx = canvas.getContext('2d');
  const scaleX = HASH_WIDTH / size.width;
  const scaleY = HASH_HEIGHT / size.height;
  const scale = Math.min(scaleX, scaleY);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, HASH_WIDTH, HASH_HEIGHT);
  ctx.strokeStyle = 'black';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1, 4 * scale);

  strokes.forEach(points => {
    if (!Array.isArray(points) || points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x * scaleX, points[0].y * scaleY);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
    }
    ctx.stroke();
  });

  const imageData = await ctx.getImageData(0, 0, HASH_WIDTH, HASH_HEIGHT);
  return getLuma(Object.values(imageData.data));
};
const normalize = async (canvas, uri) => {
  const resolved = await resolveCanvasSrc(uri);
  const src = resolved;
  canvas.width = HASH_WIDTH;
  canvas.height = HASH_HEIGHT;
  const ctx = canvas.getContext('2d');
  const newImage = new Image(canvas);

  return new Promise((resolve, reject) => {
    newImage.addEventListener('load', async () => {
      try {
        ctx.drawImage(newImage, 0, 0, HASH_WIDTH, HASH_HEIGHT);
        const imageData = await ctx.getImageData(
          0,
          0,
          HASH_WIDTH,
          HASH_HEIGHT,
        );
        const data = getLuma(Object.values(imageData.data));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });

    newImage.addEventListener('error', e => {
      console.log('image load error', e);
      reject(e);
    });

    newImage.src = src;
  });
};
export { edgeify, normalizeStrokes, threshold };
export default normalize;
