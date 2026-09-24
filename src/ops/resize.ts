// resize.ts - Scales an image to any size using nearest-neighbor sampling.

import { PixelImage } from "../PixelImage";

export function resizeNearest(img: PixelImage, newRows: number, newCols: number): PixelImage {
  const output = PixelImage.blank(newRows, newCols);

  // Loop over every pixel of the output image and map it to the nearest source pixel
  for (let row = 0; row < newRows; row++) {
    const srcRow = Math.floor(row * img.rows / newRows);

    for (let col = 0; col < newCols; col++) {
      const srcCol = Math.floor(col * img.cols / newCols);
      output.setPixel(row, col, img.getPixel(srcRow, srcCol));
    }
  }

  return output;

}
