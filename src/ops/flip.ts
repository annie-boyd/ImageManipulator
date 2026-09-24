// flip.ts - Mirrors an image top to bottom

import { PixelImage } from "../PixelImage";

export function flipVertical(img: PixelImage): PixelImage {

  //copy a blank image with the same size
  const output = PixelImage.blank(img.rows, img.cols);

  // loops through to copy over each row, flipping it
  for (let row = 0; row < img.rows; row++) {
    const sourceRow = img.rows - 1 - row;
    for (let col = 0; col < img.cols; col++) {
      output.setPixel(row, col, img.getPixel(sourceRow, col));
    }
  }
  return output;
}
