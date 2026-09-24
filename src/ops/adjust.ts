/* adjust.ts - brightness and saturation

   brightness: amount added to every channel (-100 to 100, 0 is no change)
   saturation: (0 = grayscale, 1 = no change, 2 = extra colorful)
*/

import { PixelImage, type Color } from "../PixelImage";

export function adjustColor(img: PixelImage, brightness: number, saturation: number): PixelImage {
  const output = PixelImage.blank(img.rows, img.cols);

  for (let row = 0; row < img.rows; row++) {
    for (let col = 0; col < img.cols; col++) {
      // get the pixel color
      const { r, g, b } = img.getPixel(row, col);

      // saturation from the average of r, g, b
      const gray = (r + g + b) / 3;

      const newR = clamp(gray + (r - gray) * saturation + brightness);
      const newG = clamp(gray + (g - gray) * saturation + brightness);
      const newB = clamp(gray + (b - gray) * saturation + brightness);

      const newColor: Color = { r: newR, g: newG, b: newB };
      output.setPixel(row, col, newColor);
    }
  }
  return output;
}

// rounds to a whole number and keeps it in the 0-255 range
function clamp(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}
