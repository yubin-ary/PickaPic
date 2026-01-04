const WIDTH = 17;

const getBits = async luma => {
  const bits = [];
  for (let i = 0; i < luma.length; i++) {
    if (i % WIDTH === WIDTH - 1) continue;
    bits.push(luma[i] < luma[i + 1] ? 1 : 0);
  }
  return bits;
};
const getHex = async bits => {
  let hex = '';
  for (let i = 0; i + 3 < bits.length; i += 4) {
    const nibble = `${bits[i]}${bits[i + 1]}${bits[i + 2]}${bits[i + 3]}`;
    hex += parseInt(nibble, 2).toString(16);
  }
  return hex;
};

const dhash = async luma => {
  const binary = await getBits(luma);
  const hex = await getHex(binary);

  return hex;
  //16진수 16개합체된 문자열 내보넴
};
export default dhash;
