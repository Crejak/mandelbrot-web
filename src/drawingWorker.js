importScripts("utils.js", "colors.js", "mandelbrot.js");

onmessage = function (message) {
    /**
     * @type {{
     *  dimensionVector: Vector,
     *  realRect: Rectangle,
     *  pixelScale: number,
     *  iterationCount: number,
     *  colorMap: ColorMap
     * }}
     */
    let {
        dimensionVector,
        realRect,
        pixelScale,
        iterationCount,
        colorMap
    } = message.data;
    while (pixelScale >= 1) {
        const imageData = computeBuffer(dimensionVector, realRect, pixelScale, iterationCount, colorMap);
        postMessage({endMessage: false, data: imageData});
        if (pixelScale === 1) {
            break;
        }
        pixelScale = Math.ceil(pixelScale / 2);
    }
    postMessage({endMessage: true});
};
