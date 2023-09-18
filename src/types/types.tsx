export enum Layer {
    Stations        = 'stations',
    Communes        = 'communes',
    Neighbourhoods  = 'nhoods',
    Arrondissements = 'arronds',
}

export enum BikeType {
    All   = 'all',
    Green = 'green',
    Blue  = 'blue',
}

export enum DayOfWeek {
    Monday    = 0,
    Tuesday   = 1,
    Wednesday = 2,
    Thursday  = 3,
    Friday    = 4,
    Saturday  = 5,
    Sunday    = 6,
    //All       = 7,
}

export type Legend = {
    [value: string]: {
        fillColor: string,
        label: string,
    }
}

export type LegendCollection = {
    [key in Layer]: Legend
}

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export function roundTo(n: number, digits: number) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = Number((Math.round(n) / multiplicator).toFixed(digits));
    if (negative) {
        n = Number((n * -1).toFixed(digits));
    }
    return n;
}

export function avgArray(nArr: number[]): number {
    let sum = 0;
    nArr.forEach(n => {sum += n})
    return sum / nArr.length;
}

export function medArray(nArr: number[]): number {
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;
    
    nArr.forEach(n => {
        if (n > max) max = n;
        if (n < min) min = n;
    })

    return ((max - min) / 2.0) + min;
}