const LOW_FREQ_SIZE = 8;

const getMedian = values => {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const getBits = async luma => {
  const size = Math.round(Math.sqrt(luma.length));
  if (size * size !== luma.length) {
    return [];
  }

  const dct = [];
  for (let u = 0; u < LOW_FREQ_SIZE; u++) {
    for (let v = 0; v < LOW_FREQ_SIZE; v++) {
      let sum = 0;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const f = luma[x * size + y];
          sum +=
            f *
            Math.cos(((2 * x + 1) * u * Math.PI) / (2 * size)) *
            Math.cos(((2 * y + 1) * v * Math.PI) / (2 * size));
        }
      }
      const cu = u === 0 ? 1 / Math.sqrt(2) : 1;
      const cv = v === 0 ? 1 / Math.sqrt(2) : 1;
      dct.push((cu * cv * sum) / 4);
    }
  }

  const median = getMedian(dct.slice(1));
  return dct.map(value => (value > median ? 1 : 0));
};

const getHex = async bits => {
  let hex = '';
  for (let i = 0; i + 3 < bits.length; i += 4) {
    const nibble = `${bits[i]}${bits[i + 1]}${bits[i + 2]}${bits[i + 3]}`;
    hex += parseInt(nibble, 2).toString(16);
  }
  return hex;
};

const phash = async luma => {
  const bits = await getBits(luma);
  const hex = await getHex(bits);
  return hex;
};

export default phash;
