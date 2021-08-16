 /**
 * @param {Vector} dimensionVector
 * @param {Rectangle} realRect
 * @param {number} pixelScale 
 * @param {number} iterationCount
 * @param {ColorMap} colorMap
 */
 function computeBuffer(dimensionVector, realRect, pixelScale, iterationCount, colorMap) {
    let imageBuffer = new ImageData(dimensionVector.x, dimensionVector.y);
    let pixel = zero();
    const bufferRect = getRectangle(imageBuffer);
    while (pixel.y < imageBuffer.height) {
        while (pixel.x < imageBuffer.width) {
            const c = scale(pixel, bufferRect, realRect);
            const belongs = belongToSet(c, iterationCount);

            // console.log(`Pixel (${pixel.x}; ${pixel.y}) -> c (${c.x}; ${c.y}), result : (${belongs.result}, ${belongs.weight})`);

            /**
             * @type {Rectangle}
             */
            const pixelRect = {x: pixel.x, y: pixel.y, w: pixelScale, h: pixelScale};
            if (belongs.result) {
                setColorRect(imageBuffer, pixelRect, $BLACK);
            } else {
                setColorRect(imageBuffer, pixelRect, getColorFromMapCycle(colorMap, belongs.weight));
            }

            pixel.x += pixelScale;
        }
        pixel.x = 0;
        pixel.y += pixelScale;
    }
    return imageBuffer;
}

/**
 * @param {Vector} c 
 * @param {number} iterationCount
 * 
 * @returns {WeightedResult}
 */
function belongToSet(c, iterationCount) {
    let z = zero();
    let i = 0;

    while (smod(z) < 4.0 && i < iterationCount) {

        z = add(square(z), c);
        i += 1;
    }

    if (i >= iterationCount) {
        return {result: true, weight: NaN};
    }
    return {result: false, weight: i};
}