///////////////////////////////
// FONCTIONS UTILES ET JSDOC //
///////////////////////////////

/**
 * @private
 * 
 * @typedef {{x: number, y: number}} Vector
 * @typedef {{x: number, y: number, w: number, h: number}} Rectangle
 * @typedef {{result: boolean, weight: number}} WeightedResult
 * @typedef {{r: number, g: number, b: number, a: number}} Color
 * @typedef {Array<{x: number, c: Color}>} ColorMap
 */
const _jsdoc = undefined;

/**
 * @type {Color}
 */
const $BLACK = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
};

/**
 * @type {Color}
 */
const $WHITE = {
    r: 255,
    g: 255,
    b: 255,
    a: 255
};

/**
 * @type {Color}
 */
const $BLUE = {
    r: 0,
    g: 0,
    b: 255,
    a: 255
};

/**
 * @type {Color}
 */
const $YELLOW = {
    r: 255,
    g: 255,
    b: 0,
    a: 255
};

/**
 * @type {Color}
 */
const $GREEN = {
    r: 0,
    g: 255,
    b: 0,
    a: 255
};

/**
 * @type {ColorMap}
 */
const $MAP_BLACK_AND_WHITE = [
    {
        x: 0,
        c: $WHITE
    },
    {
        x: 100,
        c: $BLACK
    }
];

const $MAP_BLUE_TO_RED = [
    {
        x: 0,
        c: $BLUE
    },
    {
        x: 50,
        c: $YELLOW
    },
    {
        x: 100,
        c: $GREEN
    }
];

/**
 * @param {ColorMap} colorMap 
 * @param {number} x 
 * 
 * @returns {Color}
 */
function getColorFromMap(colorMap, x) {
    for (let i = 0; i < colorMap.length - 1; i += 1) {
        if (x <= colorMap[i + 1].x) {
            return colorLerp(colorMap[i].c, colorMap[i + 1].c,
                (x - colorMap[i].x) / (colorMap[i + 1].x - colorMap[i].x))
        }
    }
    return colorMap[colorMap.length - 1].c;
}

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
    }
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
 * @param {Color} colorA 
 * @param {Color} colorB 
 * @param {number} t 
 * @returns {Color}
 */
function colorLerp(colorA, colorB, t) {
    return {
        r: lerp(colorA.r, colorB.r, t),
        g: lerp(colorA.g, colorB.g, t),
        b: lerp(colorA.b, colorB.b, t),
        a: lerp(colorA.a, colorB.a, t)
    };
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

/////////////////
// APPLICATION //
/////////////////

class ApplicationState {    
    constructor() {
        /**
         * @type {Rectangle}
         * @private
         */
        this._realRect = {
            x: -2.0,
            y: -1.5,
            w: 3.0,
            h: 3.0
        };

        /**
         * @type {number}
         * @private
         */
        this._iterationCount = 100;

        /**
         * @type {number}
         * @private
         */
        this._divergenceLimit = 4.0;

        /**
         * @type {number}
         * @private
         */
        this._maxPixelScale = 16;

        /**
         * @type {Drawer}
         * @private
         */
        this._drawer = undefined;

        /**
         * @type {Map<String, Array<(state: ApplicationState) => any>>}
         * @private
         */
        this._listeners = new Map();
        this._listeners.set("real_rectangle_changed", []);
        this._listeners.set("iteration_count_changed", []);
    }

    // Event listeners
    //////////////////

    /**
     * @param {String} event 
     * @param {(state: ApplicationState) => any} listener 
     */
    addListener(event, listener) {
        const eventName = event.toLowerCase();
        if (!this._listeners.has(eventName)) {
            throw "Invalid event";
        }

        this._listeners.get(eventName).push(listener);
    }

    /**
     * @param {String} event 
     */
    notifyListeners(event) {
        const eventName = event.toLowerCase();
        if (!this._listeners.has(eventName)) {
            throw "Invalid event";
        }
        
        const state = this;
        this._listeners
            .get(eventName)
            .forEach((listenerCallback) => {
                listenerCallback(state)
            });
    }

    // Getters & setters
    ////////////////////

    /**
     * @returns {Rectangle}
     */
    get realRect() {
        return this._realRect;
    }

    /**
     * @param {Rectangle} rect 
     */
    setRealRect(rect) {
        this._realRect = {...rect};
        this.notifyListeners("real_rectangle_changed");
    }

    /**
     * @returns {number}
     */
    get iterationCount() {
        return this._iterationCount;
    }

    /**
     * @param {number} iterationCount 
     */
    setIterationCount(iterationCount) {
        this._iterationCount = iterationCount;
        this.notifyListeners("iteration_count_changed")
    }

    /**
     * @returns {number}
     */
    get divergenceLimit() {
        return this._divergenceLimit;
    }

    /**
     * @returns {number}
     */
    get maxPixelScale() {
        return this._maxPixelScale;
    }

    /**
     * @returns {Drawer}
     */
    get drawer() {
        return this._drawer;
    }

    /**
     * @param {Drawer} drawer 
     */
    setDrawer(drawer) {
        this._drawer = drawer;
    }
}

const $appState = new ApplicationState();


///////////////////////////
// DESSIN DE LA FRACTALE //
///////////////////////////

class Drawer {
    constructor() {
        /**
         * @type {HTMLCanvasElement}
         * @private
         */
        this._canvas = document.getElementById("canvas");

        /**
         * @type {CanvasRenderingContext2D}
         * @private
         */
        this._ctx = this._canvas.getContext("2d");

        /**
         * @type {ImageData}
         * @private
         */
        this._imageBuffer = this._ctx.createImageData(this._canvas.width, this._canvas.height);

        /**
         * @type {boolean}
         * @private
         */
        this._isDrawing = false;

        /**
         * @type {number}
         * @private
         */
        this._currentPixelScale = Infinity;

        /**
         * @type {number}
         * @private
         */
        this._currentAnimationFrameHandle = undefined;

        $appState.addListener("real_rectangle_changed", (state) => {
            this.startDrawing();
        });

        $appState.addListener("iteration_count_changed", (state) => {
            this.startDrawing();
        });
    }

    startDrawing() {
        window.cancelAnimationFrame(this._currentAnimationFrameHandle);
        this._currentPixelScale = Infinity;
        this._isDrawing = false;
        this._draw();
    }

    /**
     * @private
     */
    async _draw() {
        this._currentAnimationFrameHandle = window.requestAnimationFrame(this._draw.bind(this));

        if (this._isDrawing || this._currentPixelScale === 1) {
            return;
        }

        if (this._currentPixelScale > $appState.maxPixelScale) {
            this._currentPixelScale = $appState.maxPixelScale;
        } else {
            this._currentPixelScale = Math.ceil(this._currentPixelScale / 2);
            if (this._currentPixelScale < 1) {
                this._currentPixelScale = 1;
            }
        }
        await this._computeBuffer(this._currentPixelScale);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.putImageData(this._imageBuffer, 0, 0);
    }
    
    /**
     * @private
     * 
     * @param {number} pixelScale 
     */
    async _computeBuffer(pixelScale = 1) {
        let pixel = zero();
        const bufferRect = getRectangle(this._imageBuffer);
        const realRect = $appState.realRect;
        while (pixel.y < this._imageBuffer.height) {
            while (pixel.x < this._imageBuffer.width) {
                const c = scale(pixel, bufferRect, realRect);
                const belongs = this._belongToSet(c);

                // console.log(`Pixel (${pixel.x}; ${pixel.y}) -> c (${c.x}; ${c.y}), result : (${belongs.result}, ${belongs.weight})`);
    
                /**
                 * @type {Rectangle}
                 */
                const pixelRect = {x: pixel.x, y: pixel.y, w: pixelScale, h: pixelScale};
                if (belongs.result) {
                    setColorRect(this._imageBuffer, pixelRect, $BLACK);
                } else {
                    setColorRect(this._imageBuffer, pixelRect, getColorFromMap($MAP_BLUE_TO_RED, belongs.weight));
                }
    
                pixel.x += pixelScale;
            }
            pixel.x = 0;
            pixel.y += pixelScale;
        }
    }
    
    /**
     * @private
     * 
     * @param {Vector} c 
     * 
     * @returns {WeightedResult}
     */
    _belongToSet(c) {
        let z = zero();
        let i = 0;
    
        while (smod(z) < $appState.divergenceLimit 
            && i < $appState.iterationCount) {
    
            z = add(square(z), c);
            i += 1;
        }
    
        if (i >= $appState.iterationCount) {
            return {result: true, weight: NaN};
        }
        return {result: false, weight: i};
    }
}

/////////////////////////
// DEPLACEMENT ET ZOOM //
/////////////////////////

function createMouseHandlers() {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    canvas = document.getElementById("canvas");

    /**
     * @type {Rectangle}
     * @private
     */
    canvasRect = {x: 0, y: 0, w: canvas.width, h: canvas.height };

    /**
     * @type {boolean}
     * @private
     */
    isMouseDownOnCanvas = false;

    canvas.addEventListener("mousedown", () => {
        isMouseDownOnCanvas = true;
    });

    window.addEventListener("mouseup", () => {
        isMouseDownOnCanvas = false;
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!isMouseDownOnCanvas) {
            return;
        }
        /**
         * @type {Vector}
         */
        const realMovement = {
            x: event.movementX / canvas.width * $appState.realRect.w,
            y: event.movementY / canvas.height * $appState.realRect.h,
        };
        /**
         * @type {Rectangle}
         */
        const newRealRect = {
            ...$appState.realRect,
            x: $appState.realRect.x - realMovement.x,
            y: $appState.realRect.y - realMovement.y
        };
        $appState.setRealRect(newRealRect);
        // console.log(`New rect (${$appState.realRect.x}, ${$appState.realRect.y}, ${$appState.realRect.w}, ${$appState.realRect.h})`);
    });

    canvas.addEventListener("wheel", (event) => {
        let newRealRect = {...($appState.realRect)};
        const deltaPixels = getVerticalDeltaPixels(event);
        const zoomScale = Math.pow(1.5, deltaPixels);

        const realCursorPos = scale({x: event.offsetX, y: event.offsetY}, canvasRect, newRealRect);
        
        newRealRect.w *= zoomScale;
        newRealRect.h *= zoomScale;
        newRealRect.x = realCursorPos.x - (realCursorPos.x - newRealRect.x) * zoomScale;
        newRealRect.y = realCursorPos.y - (realCursorPos.y - newRealRect.y) * zoomScale;
        $appState.setRealRect(newRealRect);
    });
}

//////////////////
// DATA BINDING //
//////////////////

function createControlsHandlers() {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    canvas = document.getElementById("canvas");

    /**
     * @type {Rectangle}
     * @private
     */
    canvasRect = {x: 0, y: 0, w: canvas.width, h: canvas.height };

    $appState.addListener("real_rectangle_changed", (state) => {
        const center = getCenter(state.realRect);
        const width = state.realRect.w;
        document.querySelector('input[name="re-coord"]').value = center.x;
        document.querySelector('input[name="im-coord"]').value = center.y;
        document.querySelector('input[name="width"]').value = width;
    });

    canvas.addEventListener("mousemove", (event) => {
        const realCursorPos = scale({x: event.offsetX, y: event.offsetY}, canvasRect, $appState.realRect);
        document.getElementById("cursor-pos").innerText = `(${realCursorPos.x}; ${realCursorPos.y})`;
    });

    canvas.addEventListener("mouseleave", (event) => {
        document.getElementById("cursor-pos").innerText = "cursor outside the graph";
    });

    document.getElementById("go-button").addEventListener("click", (event) => {
        const center = {
            x: parseFloat(document.querySelector('input[name="re-coord"]').value),
            y: parseFloat(document.querySelector('input[name="im-coord"]').value)
        };
        const width = parseFloat(document.querySelector('input[name="width').value);
        const height = width;

        const rect = {
            x: center.x - width / 2,
            y: center.y - height / 2,
            w: width,
            h: height
        };

        if (isValidRect(rect)) {
            $appState.setRealRect(rect);
        }
    });

    document.querySelector('input[name="max-iteration"]').value = $appState.iterationCount;
    document.getElementById("max-iteration-value").innerText = $appState.iterationCount;
    document.querySelector('input[name="max-iteration"]').addEventListener("input", (event) => {
        document.getElementById("max-iteration-value").innerText = event.target.value;
        $appState.setIterationCount(event.target.value);
    });

    $appState.notifyListeners("real_rectangle_changed");
}

//////////
// MAIN //
//////////

function main() {
    console.log("loaded");
    $appState.setDrawer(new Drawer());
    $appState.drawer.startDrawing();
    createMouseHandlers();
    createControlsHandlers();
}