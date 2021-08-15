///////////////////////////////
// FONCTIONS UTILES ET JSDOC //
///////////////////////////////

/**
 * @private
 * 
 * @typedef {{x: number, y: number}} Vector
 * @typedef {{x: number, y: number, w: number, h: number}} Rectangle
 * @typedef {{result: boolean, weight: number}} WeightedResult
 */
const _jsdoc = undefined;

/**
 * @returns {Vector}
 */
function zero() {
    return {
        x: 0.0,
        y: 0.0
    };
}

/**
 * @param {Vector} v1 
 * @param {Vector} v2 
 * 
 * @returns {Vector} 
 */
function add(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    };
}

/**
 * @param {Vector} complex
 * 
 * @returns {Vector}
 */
function square(complex) {
    return {
        x: complex.x * complex.x - complex.y * complex.y,
        y: 2 * complex.x * complex.y
    };
}

/**
 * @param {Vector} complex 
 * 
 * @returns {number}
 */
function smod(complex) {
    return complex.x * complex.x + complex.y * complex.y;
}

/**
 * @param {Vector} vector 
 * @param {Rectangle} originRect 
 * @param {Rectangle} targetRect 
 * 
 * @returns {Vector}
 */
function scale(vector, originRect, targetRect) {
    return {
        x: targetRect.x + (vector.x - originRect.x) * targetRect.w / originRect.w,
        y: targetRect.y + (vector.y - originRect.y) * targetRect.h / originRect.h
    };
}

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 * @returns {number}
 */
function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

/**
 * @param {Rectangle} rect 
 * 
 * @returns {Vector}
 */
function getCenter(rect) {
    return {
        x: rect.x + rect.w / 2,
        y: rect.y + rect.h / 2
    };
}

/**
 * @param {Rectangle} rect 
 * 
 * @returns {boolean}
 */
function isValidRect(rect) {
    return typeof(rect.x) === "number"
        && typeof(rect.y) === "number"
        && typeof(rect.w) === "number"
        && typeof(rect.h) === "number"
        && !isNaN(rect.x)
        && !isNaN(rect.y)
        && !isNaN(rect.w)
        && !isNaN(rect.h);
}

/**
 * @param {ImageData} imageData
 * @param {Vector} point 
 * 
 * @returns {Color}
 */
function getColor(imageData, point) {
    if (point.x >= imageData.width || point.x < 0 || point.y >= imageData.height || point.y < 0) {
        throw "Invalid point";
    }
    const baseIndex = (point.y * (imageData.width * 4)) + (point.x * 4);
    return {
        r: imageData.data[baseIndex],
        g: imageData.data[baseIndex + 1],
        b: imageData.data[baseIndex + 2],
        a: imageData.data[baseIndex + 3],
    };
}

/**
 * @param {ImageData} imageData 
 * @param {Vector} point 
 * @param {Color} color 
 */
function setColor(imageData, point, color) {
    if (point.x >= imageData.width || point.x < 0 || point.y >= imageData.height || point.y < 0) {
        throw "Invalid point";
    }
    const baseIndex = (point.y * (imageData.width * 4)) + (point.x * 4);
    imageData.data[baseIndex] = color.r;
    imageData.data[baseIndex + 1] = color.g;
    imageData.data[baseIndex + 2] = color.b;
    imageData.data[baseIndex + 3] = color.a;
}

/**
 * @param {ImageData} imageData 
 * @param {Rectangle} rect 
 * @param {Color} color 
 */
function setColorRect(imageData, rect, color) {
    if (rect.x + rect.w > imageData.width) {
        rect.w = imageData.width - rect.x;
    }
    if (rect.y + rect.h > imageData.height) {
        rect.h = imageData.height - rect.y;
    }

    let baseIndex = 0;
    for (let row = 0; row < rect.h; row += 1) {
        for (let col = 0; col < rect.w; col += 1) {
            baseIndex = (rect.y + row) * (imageData.width * 4) + (rect.x + col) * 4;
            imageData.data[baseIndex] = color.r;
            imageData.data[baseIndex + 1] = color.g;
            imageData.data[baseIndex + 2] = color.b;
            imageData.data[baseIndex + 3] = color.a;
        }
    }
}

/**
 * @param {ImageData} imageData 
 * 
 * @returns {Rectangle}
 */
function getRectangle(imageData) {
    return {
        x: 0,
        y: 0,
        w: imageData.width,
        h: imageData.height
    };
}

/**
 * @param {WheelEvent} wheelEvent 
 */
function getVerticalDeltaPixels(wheelEvent) {
    if (wheelEvent.deltaMode === 0) {
        return wheelEvent.deltaY;
    }
    if (wheelEvent.deltaMode === 1) {
        return wheelEvent.deltaY / 16;
    }
    if (wheelEvent.deltaMode === 2) {
        return wheelEvent.deltaY / window.innerHeight;
    }
}

