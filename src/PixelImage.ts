/* PixelImage.ts
 Wraps the browser's ImageData so the app can work in rows/cols 
 and Colors instead of raw RGBA byte offsets.


 the browser's ImageData properties are:
 - width: number
 - height: number
 - data: Uint8ClampedArray (RGBA values, each 0-255)
      - the A in RGBA is for alpha and represents transparency
          - 0 is transparent, 255 is opaque
*/

// (r, g, b are each 0-255)
export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Rect = {
  row: number;
  col: number;
  rows: number;
  cols: number;
};

// PixelImage wraps the browser's ImageData and provides a row/col based API.
export class PixelImage {
  private imageData: ImageData;

  constructor(imageData: ImageData) {
    this.imageData = imageData;
  }

  // Creates an empty rows x cols image.
  static blank(rows: number, cols: number): PixelImage {
    // all set to 0, which means the image is black
    const imageData = new ImageData(new Uint8ClampedArray(rows * cols * 4), cols, rows);
    return new PixelImage(imageData);
  }

  get rows(): number {
    return this.imageData.height;
  }

  get cols(): number {
    return this.imageData.width;
  }

  // Returns a copy of the pixel's color, not a reference into the data.
  getPixel(row: number, col: number): Color {

    this.checkBounds(row, col);
    const index = this.index(row, col);
    const data = this.imageData.data;

    // return a new Color with the rgb values from the flat RGBA array
    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2]
    };
  }
  // Sets the pixel at the given row and col to the specified color.
  setPixel(row: number, col: number, color: Color): void {
    this.checkBounds(row, col);
    const index = this.index(row, col);
    const data = this.imageData.data;

    // write rgba values
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = 255; // set alpha to 255 so the pixel is visible
  }

  // Deep copy so that the original is not changed
  clone(): PixelImage {
    const newData = new Uint8ClampedArray(this.imageData.data);
    const newImageData = new ImageData(newData, this.imageData.width, this.imageData.height);
    return new PixelImage(newImageData);
  }

  // Lets main.ts draw the image onto a canvas.
  toImageData(): ImageData {
    return this.clone().imageData;
  }

  // helper method to check bounds
  private checkBounds(row: number, col: number): void {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new RangeError("Pixel coordinates out of bounds");
    }
  }
  // helper method to compute the index into the flat RGBA array
  private index(row: number, col: number): number {
    return (row * this.cols + col) * 4;
  }
}
