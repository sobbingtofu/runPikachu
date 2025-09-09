export const getResponsiveSizeParams = (number: number): number => {
  if (window.innerWidth >= 1050) {
    return number;
  } else {
    const currentWidth = window.innerWidth;
    return Math.floor(currentWidth * 0.9 * (number / 1000));
  }
};
