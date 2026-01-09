const hamming = (sketchHex, albumHex) => {
  //hamming 거리 계산 -> 점수로 바꾼다.
  //hamming distance 는 서로 다른 비트의 갯수.
  const distances = [];
  albumHex.forEach(hex => {
    let dist = 0;
    const len = Math.min(sketchHex.length, hex.length);
    for (let i = 0; i < len; i++) {
      if (sketchHex[i] !== hex[i]) {
        dist += 1;
      }
    }
    distances.push(dist);
  });
  return distances;
};
export default hamming;
