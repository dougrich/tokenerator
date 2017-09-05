export interface StyleSet {
    'font': string;
    'font-family': string;
    'font-size': string;
    'font-size-adjust': string;
    'font-stretch': string;
    'font-style': string;
    'font-variant': string;
    'font-weight': string;
    'direction': string;
    'letter-spacing': string;
    'text-decoration': string;
    'unicode-bidi': string;
    'word-spacing': string;
    'clip': string;
    'color': string;
    'cursor': string;
    'display': string;
    'overflow': string;
    'visibility': string;
    'clip-path': string;
    'clip-rule': string;
    'mask': string;
    'opacity': string;
    'enable-background': string;
    'filter': string;
    'flood-color': string;
    'flood-opacity': string;
    'lighting-color': string;
    'stop-color': string;
    'stop-opacity': string;
    'pointer-events': string;
    'color-interpolation': string;
    'color-interpolation-filters': string;
    'color-profile': string;
    'color-rendering': string;
    'fill': string;
    'fill-rule': string;
    'fill-opacity': string;
    'image-rendering': string;
    'marker': string;
    'marker-end': string;
    'marker-mid': string;
    'marker-start': string;
    'shape-rendering': string;
    'stroke': string;
    'stroke-dasharray': string;
    'stroke-dashoffset': string;
    'stroke-linecap': string;
    'stroke-linejoin': string;
    'stroke-miterlimit': string;
    'stroke-opacity': string;
    'stroke-width': string;
    'text-rendering': string;
    'alignment-baseline': string;
    'baseline-shift': string;
    'dominant-baseline': string;
    'glyph-orientation-horizontal': string;
    'glyph-orientation-vertical': string;
    'kerning': string;
    'text-anchor': string;
    'writing-mode': string;
}

export function parse(style: string): StyleSet {
    const set: StyleSet = {} as any;
    style.split(';').forEach(part => {
        const [key, value] = part.split(':');
        set[key] = value;
    });
    return set;
}

export function serialize(set: StyleSet): string {
    return Object.keys(set).map(key => {
        return `${key}:${set[key]}`;
    }).join(';');
}