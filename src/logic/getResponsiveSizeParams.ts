export const getResponsiveSizeParams = (
  number: number,
  type?: 'floor' | 'noFloor',
): number => {
  if (window.innerWidth >= 1050) {
    return number;
  } else {
    const currentWidth = window.innerWidth;
    const responsiveValue = (currentWidth * 0.9 * number) / 1000;
    return type === 'noFloor' ? responsiveValue : Math.floor(responsiveValue);
  }
};
