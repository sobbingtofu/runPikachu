export function getGameAreaSize(): { width: number; height: number } {
  if (window.innerWidth >= 1050) {
    return { width: 1000, height: 450 };
  } else {
    const currentWidth = window.innerWidth;
    return {
      width: Math.floor(currentWidth * 0.9),
      height: Math.floor(currentWidth * 0.9 * 0.45),
    };
  }
}

export function getPikachuSize(): {
  pikachuWidth: number;
  pikachuHeight: number;
} {
  if (window.innerWidth >= 1050) {
    // return { pikachuWidth: 1000, pikachuHeight: 450 };
    return { pikachuWidth: 80, pikachuHeight: 53 };
  } else {
    const currentWidth = window.innerWidth;
    return {
      pikachuWidth: Math.floor(currentWidth * 0.9 * 0.08),
      pikachuHeight: Math.floor(currentWidth * 0.9 * 0.053),
    };
  }
}
