export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

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