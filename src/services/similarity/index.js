import normalize from './preprocess/normalize';
import dhash from './hash/dhash';
const compareImages = async ({ canvas, sketchUri, photoUris, option }) => {
  // options 에서 상위 몇개 추출할건지..  등 전달
  // 1. normalize 호출 :  greyscale
  // 2. dhash : 양 옆 비교해서 2진법 - > 16진수 64개로  변경(비교용이))
  /* normalize(sketchUri); //return luma
    dhash(luma); //return hex
    hamming(hex); // return  score */
  if (!canvas || typeof canvas.getContext !== 'function') {
    return;
  }
  const sketchLuma = await normalize(canvas, sketchUri);
  if (!Array.isArray(sketchLuma) || sketchLuma.length === 0) {
    return;
  }
  const sketchHex = await dhash(sketchLuma);

  const albumHex = [];
  for (const uri of photoUris) {
    const luma = await normalize(canvas, uri);
    if (Array.isArray(luma) && luma.length > 0) {
      albumHex.push(await dhash(luma));
    }
  }
  console.log(sketchHex);
  console.log(albumHex[0]);
};
export default compareImages;
