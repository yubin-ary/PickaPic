const dhash = luma => {
  const bits = [];
  for (let i = 0; i < luma.length; i += 1) {
    if (i % 9 === 8) continue;
    bits.push(luma[i] < luma[i + 1] ? 1 : 0);
  }

  let hex = '';
  for (let i = 0; i + 3 < bits.length; i += 4) {
    const nibble = `${bits[i]}${bits[i + 1]}${bits[i + 2]}${bits[i + 3]}`;
    hex += parseInt(nibble, 2).toString(16);
  }

  return hex;
  //16진수 16개 들어잇는 배열내보냄
};
export default dhash;
