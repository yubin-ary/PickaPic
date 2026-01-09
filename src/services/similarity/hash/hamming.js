const hamming = (sketchHex, albumHex) => {
  //hamming 거리 계산 -> 점수로 바꾼다.
  //hamming distance 는 서로 다른 비트의 갯수.
  const hammingArr = [];
  albumHex.forEach((hex, idx) => {
    let dist = 0;
    const len = Math.min(sketchHex.length, hex.length);
    for (let i = 0; i < len; i++) {
      if (sketchHex[i] !== hex[i]) {
        dist += 1;
      }
    }
    hammingArr.push([idx, dist]);
  });
  const top5 = hammingArr
    .slice()
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5);
  console.log(top5);
  const top5Index = top5.map(v => v[0]);
  return top5Index;
};
export default hamming;
