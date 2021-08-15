/**
 * @typedef {{r: number, g: number, b: number, a: number}} Color
 * @typedef {Array<{x: number, c: Color}>} ColorMap
 */
const _colors = undefined;

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
 const $LIGHT_GRAY = {
    r: 200,
    g: 200,
    b: 200,
    a: 255
};

/**
 * @type {Color}
 */
 const $DARK_GRAY = {
    r: 100,
    g: 100,
    b: 100,
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
 * @type {Color}
 */
const $RED = {
    r: 255,
    g: 0,
    b: 0,
    a: 255
};

/**
 * @type {Color}
 */
 const $CYAN = {
    r: 0,
    g: 255,
    b: 255,
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
        x: 50,
        c: $LIGHT_GRAY
    },
    {
        x: 500,
        c: $DARK_GRAY
    },
    {
        x: 5000,
        c: $BLACK
    }
];

const $MAP_BLUE_TO_GREEN = [
    {
        x: 0,
        c: $BLUE
    },
    {
        x: 50,
        c: $YELLOW
    },
    {
        x: 500,
        c: $RED
    },
    {
        x: 5000,
        c: $CYAN
    }
];

/**
 * @type {Map<String, ColorMap}
 */
let $ALL_MAPS = new Map();
$ALL_MAPS.set("Black and white", $MAP_BLACK_AND_WHITE);
$ALL_MAPS.set("Blue to green", $MAP_BLUE_TO_GREEN);

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