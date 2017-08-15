import { Token, Part } from '../../model';
import { PartContext } from './';

const colors = [
    "#FFFFFF",
    "#DDDDDD",
    "#BBBBBB",
    "#999999"
];

/**
 * Immutably adds a part to a token
 * @param part Part to be added to the token
 * @param token Token the part is going to be added to
 */
export function addPart(this: PartContext, token: Token, part: Part, variant?: number): Token {
    const next = { ...token };

    next.parts = [...token.parts];
    
    const newPart: Part.Rendering =
        !variant
            ? part.rendering
            : part.variants[variant].rendering;

    let i = 0;
    while (i < next.parts.length) {

        const part = this.getPart(next.parts[i].id);

        const rendering: Part.Rendering =
            !next.parts[i].variant
                ? part.rendering
                : part.variants[next.parts[i].variant].rendering;
        
        const passed = (newPart.collisionSlots & rendering.collisionSlots) === 0;

        if (passed) {
            i++;
        } else {
            next.parts.splice(i, 1);
        }
    }

    const fill = colors.slice(0, Math.min(part.layers, colors.length));
    while (fill.length < part.layers) {
        fill.push(fill[fill.length - 1]);
    }

    next.parts.push({
        id: part.id,
        variant,
        fill
    });

    return next;
}