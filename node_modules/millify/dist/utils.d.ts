/**
 * parseValue ensures the value is a number and within accepted range.
 */
export declare function parseValue(value: number): number;
/**
 * Rounds a number [value] up to a specified [precision].
 */
export declare function roundTo(value: number, precision: number): number;
/**
 * Returns the number of digits after the decimal.
 */
export declare function getFractionDigits(num: number): number;
/**
 * Returns the default browser locales.
 */
export declare function getLocales(): string[];
