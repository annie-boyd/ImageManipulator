/* carpet.ts - Sierpinski carpet: split the image area into a 3x3 grid, fill the center
cell with a solid color, and recurse into the other 8 cells.

Check here for more details on Sierpinski carpet: https://en.wikipedia.org/wiki/Sierpiński_carpet
*/

import { PixelImage } from "../PixelImage";
import type { Color, Rect } from "../PixelImage";
import { resizeNearest } from "./resize";

export function sierpinskiCarpet(img: PixelImage, depth: number, fillColor: Color): PixelImage {
  

  const out = PixelImage.blank(img.rows, img.cols);

  const area: Rect = {
    row: 0,
    col: 0,
    rows: out.rows,
    cols: out.cols,
  };
  drawCarpet(img, out, area, depth, fillColor);
  return out;
}

// Recursive helper: draws the carpet pattern into area of out.
function drawCarpet(src: PixelImage, out: PixelImage, area: Rect, depth: number, fillColor: Color): void {
  // base case: out of depth, or too small to split into thirds
  if (depth === 0 || area.rows < 3 || area.cols < 3) {
    drawScaled(src, out, area);
    return;
  }

  // boundaries of the 3 bands in each direction; using cut lines means the
  // cells always add up to the full area even when the size isn't divisible by 3
  const rowCuts = [
    area.row,
    area.row + Math.floor(area.rows / 3),
    area.row + Math.floor((2 * area.rows) / 3),
    area.row + area.rows,
  ];
  const colCuts = [
    area.col,
    area.col + Math.floor(area.cols / 3),
    area.col + Math.floor((2 * area.cols) / 3),
    area.col + area.cols,
  ];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell: Rect = {
        row: rowCuts[i],
        col: colCuts[j],
        rows: rowCuts[i + 1] - rowCuts[i],
        cols: colCuts[j + 1] - colCuts[j],
      };

      if (i === 1 && j === 1) {
        fillRect(out, cell, fillColor); // center cell is the hole
      } else {
        drawCarpet(src, out, cell, depth - 1, fillColor);
      }
    }
  }
}

// Shrinks src to the size of area and copies it into out at area's position.
function drawScaled(src: PixelImage, out: PixelImage, area: Rect): void {
  const small = resizeNearest(src, area.rows, area.cols);

  for (let r = 0; r < area.rows; r++) {
    for (let c = 0; c < area.cols; c++) {
      out.setPixel(area.row + r, area.col + c, small.getPixel(r, c));
    }
  }
}

// Fills every pixel in area with one color.
function fillRect(out: PixelImage, area: Rect, color: Color): void {
  for (let r = 0; r < area.rows; r++) {
    for (let c = 0; c < area.cols; c++) {
      out.setPixel(area.row + r, area.col + c, color);
    }
  }
}
