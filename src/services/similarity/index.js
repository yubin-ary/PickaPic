import normalize, { edgeify, threshold } from './preprocess/normalize';
import dhash from './hash/dhash';
import phash from './hash/phash';
import hamming from './hash/hamming';

const compareImages = async ({ canvas, sketchUri, photoUris, option }) => {
  // options 에서 상위 몇개 추출할건지..  등 전달
  // 1. normalize 호출 :  greyscale
  // 2. phash + dhash : 두 해시를 함께 사용
  /* normalize(sketchUri); //return luma
    phash(luma); //return hex
    dhash(luma); //return hex
    hamming(hex); // return  score */
  if (!canvas || typeof canvas.getContext !== 'function') {
    return;
  }
  const sketchLuma = await normalize(canvas, sketchUri);
  if (!Array.isArray(sketchLuma) || sketchLuma.length === 0) {
    return;
  }
  const sketchEdge = edgeify(sketchLuma);
  const sketchBin = threshold(sketchEdge, 64);
  const sketchDhash = await dhash(sketchBin);
  const sketchPhash = await phash(sketchBin);

  const albumDhash = [];
  const albumPhash = [];
  const albumUris = [];
  for (const uri of photoUris) {
    const luma = await normalize(canvas, uri);
    if (Array.isArray(luma) && luma.length > 0) {
      const edge = edgeify(luma);
      const bin = threshold(edge, 64);
      const dHex = await dhash(bin);
      const pHex = await phash(bin);
      albumDhash.push(dHex);
      albumPhash.push(pHex);
      albumUris.push(uri);
    }
  }
  const dhashDist = hamming(sketchDhash, albumDhash);
  const phashDist = hamming(sketchPhash, albumPhash);

  const weightDhash = 0.2;
  const weightPhash = 0.8;
  const topCount = option?.top ?? 5;

  const scored = albumUris.map((uri, idx) => {
    const d = dhashDist[idx] ?? Number.POSITIVE_INFINITY;
    const p = phashDist[idx] ?? Number.POSITIVE_INFINITY;
    return { uri, score: weightDhash * d + weightPhash * p };
  });
  const top = scored.sort((a, b) => a.score - b.score).slice(0, topCount);
  return top.map(v => v.uri);
};
export default compareImages;
