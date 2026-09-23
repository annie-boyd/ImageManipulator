# ImageManipulator
Image Manipulator is a browser-based image editor written in TypeScript. You upload an image, pick an effect, and download the result as a PNG. Everything runs client-side using the Canvas API, with no backend and no image-processing libraries.

*Note about this repo:* This app grew out of a C++ project that I wanted to rebuild as a web app. I'm currently in the process of reworking my project into TypeScript, changing up the algorithms, and creating a GUI!

## Features (in progress)
- Brightness and saturation adjustment
- Vertical flip
- Resize (nearest-neighbor)
- Sierpinski carpet fractal
- Color-based region segmentation

## Running locally
```
npm install
npm run dev
```
