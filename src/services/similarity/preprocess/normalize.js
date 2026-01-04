import { Image } from 'react-native-canvas';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

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
    17,
    16,
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
const normalize = async (canvas, uri) => {
  const resolved = await resolveCanvasSrc(uri);
  const src = resolved;
  canvas.width = 17;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const newImage = new Image(canvas);

  return new Promise((resolve, reject) => {
    newImage.addEventListener('load', async () => {
      try {
        ctx.drawImage(newImage, 0, 0, 17, 16);
        const imageData = await ctx.getImageData(0, 0, 17, 16);
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
export default normalize;
