import { Token, Part } from '../../model';
import { PartContext } from './';

/**
 * Edits a part
 * @param token Token to modify
 * @param index part to modify
 * @param layer layer to modify
 * @param fill new fill
 */
export function removePart(this: PartContext, token: Token, index: number): Token {
    const next = { ...token };
    next.parts = [...next.parts];
    next.parts.splice(index, 1);
    return next;
}