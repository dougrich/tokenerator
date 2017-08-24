import { Part } from '../../model';

export function aggregate(parts: Part[]) {
    const markup =
        `<svg viewBox="0 0 90 90" id="part-sheet"><defs>` +
        parts
        .map(part => {
            return part.svg.defs + Object.keys(part.svg.layers).map(key => part.svg.layers[key].markup).join('');
        })
        .join('') +
        `</defs></svg>`;

    return markup;
}