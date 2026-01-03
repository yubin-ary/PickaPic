import { Image } from 'react-native-canvas';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

const resolveCanvasSrc = async uri => {
  if (uri.startsWith('data:')) {
    return uri;
  }

  const resized = await ImageResizer.createResizedImage(uri, 9, 8, 'PNG', 100);
  const path = resized?.uri || resized?.path;
  if (!path) return uri;

  const base64 = await RNFS.readFile(path, 'base64');
  return `data:image/png;base64,${base64}`;
};

const normalize = async (canvas, uri) => {
  let data = [];
  const resolved = await resolveCanvasSrc(uri);
  const src = resolved;
  canvas.width = 9;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  const newImage = new Image(canvas);

  newImage.addEventListener('load', async () => {
    ctx.drawImage(newImage, 0, 0, 9, 8);
    const imageData = await ctx.getImageData(0, 0, 9, 8);

    console.log(imageData.data);
  });

  console.log(data);
  newImage.addEventListener('error', e => {
    console.log('image load error', e);
  });

  newImage.src = src;
};
export default normalize;
