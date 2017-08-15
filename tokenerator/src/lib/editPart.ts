import { Token, Part } from '../../model';
import { PartContext } from './';

/**
 * Edits a part
 * @param token Token to modify
 * @param index part to modify
 * @param layer layer to modify
 * @param fill new fill
 */
export function editPart(this: PartContext, token: Token, index: number, layer: number, fill: string): Token {
    const next = { ...token };
    next.parts = [...next.parts];
    next.parts[index].fill = [...next.parts[index].fill];
    next.parts[index].fill[layer] = fill;
    return next;
}