import normalize from './preprocess/normalize';
const compareImages = async ({ canvas, sketchUri, photoUris, option }) => {
  // options 에서 상위 몇개 추출할건지..  등 전달
  // 1. normalize 호출 :  greyscale
  // 2. dhash : 양 옆 비교해서 2진법 - > 16진수 16개로  변경(비교용이))
  /* normalize(sketchUri); //return luma
    dhash(luma); //return hex
    hamming(hex); // return  score */
  if (!canvas || typeof canvas.getContext !== 'function') {
    return;
  }
  await normalize(canvas, sketchUri);
};
export default compareImages;
