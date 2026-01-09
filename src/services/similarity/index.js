import normalize from './preprocess/normalize';
import phash from './hash/phash';
import hamming from './hash/hamming';

const albumHexCache = new Map();
const compareImages = async ({ canvas, sketchUri, photoUris, option }) => {
  // options 에서 상위 몇개 추출할건지..  등 전달
  // 1. normalize 호출 :  greyscale
  // 2. phash : DCT 기반 16진수 해시 생성(비교용이))
  /* normalize(sketchUri); //return luma
    phash(luma); //return hex
    hamming(hex); // return  score */
  if (!canvas || typeof canvas.getContext !== 'function') {
    return;
  }
  const sketchLuma = await normalize(canvas, sketchUri);
  if (!Array.isArray(sketchLuma) || sketchLuma.length === 0) {
    return;
  }
  const sketchHex = await phash(sketchLuma);

  const albumHex = [];
  const albumHexInfo = [];
  for (const uri of photoUris) {
    const luma = await normalize(canvas, uri);
    if (Array.isArray(luma) && luma.length > 0) {
      const hex = await phash(luma);
      albumHexCache.set(hex, uri);
      albumHex.push(hex);
      albumHexInfo.push({ hex, uri });
    }
  }
  console.log(sketchHex);
  console.log(albumHex);
  const top5Index = await hamming(sketchHex, albumHex);
  console.log(top5Index);
  const top5Uri = [];
  if (Array.isArray(top5Index)) {
    for (const idx of top5Index) {
      const entry = albumHexInfo[idx];
      if (entry?.uri) top5Uri.push(entry.uri);
    }
  }
  return top5Uri;
};
export default compareImages;
