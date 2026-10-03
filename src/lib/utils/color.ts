export const getBrightness = (hex: string = '#000000'): number => {
  let rgb;
  if (hex[0] === '#') {
    hex = hex.substring(1);
  }
  if (hex.length < 6) {
    rgb = {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
    };
  } else {
    rgb = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }
  const { r, g, b } = rgb;
  return (r * 299 + g * 587 + b * 114) / 1000;
};
