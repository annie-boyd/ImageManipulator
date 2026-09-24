// main.ts - UI for image manipulation: upload, apply effects, and download results.


import "./style.css";
import { PixelImage } from "./PixelImage";
import { flipVertical } from "./ops/flip";
import { resizeNearest } from "./ops/resize";
import { adjustColor } from "./ops/adjust";
import { sierpinskiCarpet } from "./ops/carpet";
import { segmentRegions } from "./ops/segment";

// DOM elements for the UI
const fileInput = document.querySelector("#file-input") as HTMLInputElement;
const operationSelect = document.querySelector("#operation") as HTMLSelectElement;
const runButton = document.querySelector("#run-button") as HTMLButtonElement;
const sourceCanvas = document.querySelector("#source-canvas") as HTMLCanvasElement;
const resultCanvas = document.querySelector("#result-canvas") as HTMLCanvasElement;
const downloadLink = document.querySelector("#download-link") as HTMLAnchorElement;
const resizeRowsInput = document.querySelector("#resize-rows") as HTMLInputElement;
const resizeColsInput = document.querySelector("#resize-cols") as HTMLInputElement;

// State for the current source image
let source: PixelImage | null = null;

// Handle file input changes and load the image into the source canvas and state
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const bitmap = await createImageBitmap(file);
  sourceCanvas.width = bitmap.width;
  sourceCanvas.height = bitmap.height;

  const ctx = sourceCanvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    source = new PixelImage(imageData);
  }
});

// Show only the controls for the selected mode (flip has none)
operationSelect.addEventListener("change", () => {
  document.querySelectorAll<HTMLElement>("[id$='-controls']").forEach((el) => {
    el.hidden = true;
  });

  const selected = document.querySelector<HTMLElement>(`#${operationSelect.value}-controls`);
  if (selected) {
    selected.hidden = false;
  }
});

// Handle the run button click and apply the selected operation to the source image
runButton.addEventListener("click", () => {
  if (!source) return;

  let result: PixelImage | null = null;
  if (operationSelect.value === "flip") {
    result = flipVertical(source);
  } else if (operationSelect.value === "resize") {
    const rows = Number(resizeRowsInput.value);
    const cols = Number(resizeColsInput.value);

    // empty, 0, negative, or decimal sizes would break PixelImage.blank
    if (!Number.isInteger(rows) || rows < 1 || !Number.isInteger(cols) || cols < 1) return;

    result = resizeNearest(source, rows, cols);
  }

  if (result) {
    drawToCanvas(result, resultCanvas);

    // turn the result into a PNG and point the download link at it
    resultCanvas.toBlob((blob) => {
      if (!blob) return;
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.hidden = false;
    });
  }
});

// Draw a PixelImage onto a canvas element
function drawToCanvas(img: PixelImage, canvas: HTMLCanvasElement): void {
  canvas.width = img.cols;
  canvas.height = img.rows;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.putImageData(img.toImageData(), 0, 0);

}};