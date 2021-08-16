/////////////////
// APPLICATION //
/////////////////

class ApplicationState {    
    constructor() {
        /**
         * @type {Rectangle}
         * @private
         */
        this._realRect = $LOCATION_MAP.get("Full set");

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
         * @type {String}
         * @private
         */
        this._colorMapName = $ALL_MAPS.keys().next().value;

        /**
         * @type {Map<String, Array<(state: ApplicationState) => any>>}
         * @private
         */
        this._listeners = new Map();
        this._listeners.set("real_rectangle_changed", []);
        this._listeners.set("iteration_count_changed", []);
        this._listeners.set("color_map_changed", []);
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
        this.notifyListeners("iteration_count_changed");
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

    /**
     * @return {ColorMap}
     */
    get colorMap() {
        return $ALL_MAPS.get(this._colorMapName);
    }

    /**
     * @param {String} colorMapName 
     */
    setColorMapName(colorMapName) {
        if (!$ALL_MAPS.has(colorMapName)) {
            throw "Invalid map name";
        }
        this._colorMapName = colorMapName;
        this.notifyListeners("color_map_changed");
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
         * @type {Worker}
         * @private
         */
        this._worker = undefined;
        
        /**
         * @type {number}
         * @private
         */
        this._currentAnimationFrameHandle = undefined;

        $appState.addListener("real_rectangle_changed", (state) => {
            this.startWorker();
        });

        $appState.addListener("iteration_count_changed", (state) => {
            this.startWorker();
        });

        $appState.addListener("color_map_changed", (state) => {
            this.startWorker();
        });
    }

    startWorker() {
        if (this._worker !== undefined) {
            this._worker.terminate();
            cancelAnimationFrame(this._currentAnimationFrameHandle);
        }
        this._worker = new Worker("src/drawingWorker.js");
        this._worker.onmessage = (ev) => {
            if (ev.data.endMessage) {
                // this._drawSmooth(ev.data.data);
                return;
            }
            this._currentAnimationFrameHandle = requestAnimationFrame(() => {
                this._draw(ev.data.data);
            });
        };
        this._worker.postMessage({
            dimensionVector: {x: this._canvas.width, y: this._canvas.height},
            realRect: $appState.realRect,
            pixelScale: $appState.maxPixelScale,
            iterationCount: $appState.iterationCount,
            colorMap: $appState.colorMap
        });
        this._prerender();
    }

    _prerender() {
        const imageData = computeBuffer({x: this._canvas.width, y: this._canvas.height},
            $appState.realRect,
            $appState.maxPixelScale,
            $appState.iterationCount,
            $appState.colorMap);
        this._draw(imageData);
    }

    /**
     * @private
     * 
     * @param {ImageData} imageData
     */
    _draw(imageData) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.putImageData(imageData, 0, 0);
    }

    /**
     * @private
     * 
     * @param {ImageData} imageData
     */
    _drawSmooth(imageData) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.putImageData(antialias(imageData), 0, 0);
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
    
    let colorMapSelectHtml = "";
    for (let colorMapName of $ALL_MAPS.keys()) {
        colorMapSelectHtml += `<option value="${colorMapName}">${colorMapName}</option>\n`;
    }
    document.querySelector('select[name="color-map"').innerHTML = colorMapSelectHtml;
    document.querySelector('select[name="color-map"').addEventListener("change", (event) => {
        $appState.setColorMapName(event.target.value);
    });
    
    let locationSelectHtml = "";
    for (let locationName of $LOCATION_MAP.keys()) {
        locationSelectHtml += `<option value="${locationName}">${locationName}</option>\n`;
    }
    document.querySelector('select[name="location"').innerHTML = locationSelectHtml;
    document.querySelector('select[name="location"').addEventListener("change", (event) => {
        $appState.setRealRect($LOCATION_MAP.get(event.target.value));
    });
}

//////////
// MAIN //
//////////

function main() {
    $appState.setDrawer(new Drawer());
    $appState.drawer.startWorker();
    createMouseHandlers();
    createControlsHandlers();
}