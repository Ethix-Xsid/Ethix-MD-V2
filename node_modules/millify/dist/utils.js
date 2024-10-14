"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocales = exports.getFractionDigits = exports.roundTo = exports.parseValue = void 0;
/**
 * parseValue ensures the value is a number and within accepted range.
 */
function parseValue(value) {
    const val = parseFloat(value === null || value === void 0 ? void 0 : value.toString());
    if (isNaN(val)) {
        throw new Error(`Input value is not a number`);
    }
    if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
        throw new RangeError("Input value is outside of safe integer range");
    }
    return val;
}
exports.parseValue = parseValue;
/**
 * Rounds a number [value] up to a specified [precision].
 */
function roundTo(value, precision) {
    if (!Number.isFinite(value)) {
        throw new Error("Input value is not a finite number");
    }
    if (!Number.isInteger(precision) || precision < 0) {
        throw new Error("Precision is not a positive integer");
    }
    if (Number.isInteger(value)) {
        return value;
    }
    return parseFloat(value.toFixed(precision));
}
exports.roundTo = roundTo;
/**
 * Returns the number of digits after the decimal.
 */
function getFractionDigits(num) {
    var _a;
    if (Number.isInteger(num)) {
        return 0;
    }
    const decimalPart = num.toString().split(".")[1];
    return (_a = decimalPart === null || decimalPart === void 0 ? void 0 : decimalPart.length) !== null && _a !== void 0 ? _a : 0;
}
exports.getFractionDigits = getFractionDigits;
/**
 * Returns the default browser locales.
 */
function getLocales() {
    var _a;
    if (typeof navigator === "undefined") {
        return [];
    }
    return Array.from((_a = navigator.languages) !== null && _a !== void 0 ? _a : []);
}
exports.getLocales = getLocales;
