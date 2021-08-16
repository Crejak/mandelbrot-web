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
    r: 50,
    g: 50,
    b: 50,
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
 * @type {Color}
 */
 const $PURPLE = {
    r: 255,
    g: 0,
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
        c: $DARK_GRAY
    },
    {
        x: 100,
        c: $WHITE
    },
];

const $MAP_RAINBOW = [
    {
        x: 0,
        c: $BLUE
    },
    {
        x: 50,
        c: $CYAN
    },
    {
        x: 100,
        c: $GREEN
    },
    {
        x: 150,
        c: $YELLOW
    },
    {
        x: 200,
        c: $RED
    },
    {
        x: 250,
        c: $PURPLE
    },
    {
        x: 300,
        c: $BLUE
    }
];

const $MAP_NIGHT = [
    {
        x: 0,
        c: {r: 10, g: 10, b: 80, a: 255}
    },
    {
        x: 50,
        c: $WHITE
    },
    {
        x: 80,
        c: {r: 240, g: 140, b: 0, a: 255}
    },
    {
        x: 110,
        c: {r: 50, g: 0, b: 100, a: 255}
    },
    {
        x: 120,
        c: {r: 10, g: 10, b: 80, a: 255}
    }
];

const $MAP_TOON = [
    {
        x: 0,
        c: {r: 220, g: 112, b: 0, a: 255}
    },
    {
        x: 3,
        c: {r: 255, g: 128, b: 0, a: 255}
    },
    {
        x: 4,
        c: {r: 100, g: 20, b: 200, a: 255}
    }
];

/**
 * @type {Map<String, ColorMap}
 */
let $ALL_MAPS = new Map();
$ALL_MAPS.set("Black and white", $MAP_BLACK_AND_WHITE);
$ALL_MAPS.set("Rainbow", $MAP_RAINBOW);
$ALL_MAPS.set("Night", $MAP_NIGHT);
$ALL_MAPS.set("Toon", $MAP_TOON);

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
 * @param {ColorMap} colorMap 
 * @param {number} x 
 * 
 * @returns {Color}
 */
function getColorFromMapCycle(colorMap, x) {
    let i = 0;
    while (x > 0) {
        if (x <= colorMap[i + 1].x) {
            return colorLerp(colorMap[i].c, colorMap[i + 1].c,
                (x - colorMap[i].x) / (colorMap[i + 1].x - colorMap[i].x));
        }
        i += 1;
        if (i + 1 === colorMap.length) {
            x -= colorMap[i].x;
            i = 0;
        }
    }
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