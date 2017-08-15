import { test } from './_framework';
import { Token, Part } from '../../model';
import * as assert from 'assert';

const start: Token = {
    id: 't-0',
    revision: 0,
    parts: [
        {
            id: 'p-0',
            variant: null,
            fill: ['#FFF']
        }
    ],
    meta: {
        name: 'Example Token',
        tags: [],
        description: 'Example',
        author: ''
    },
    created: ''
};

test('Add part replaces colliding', tokenerator => {
    const next = tokenerator.addPart(start, tokenerator.getPart('p-1'));

    assert.notStrictEqual(start, next);
    assert.strictEqual(start.meta, next.meta);
    assert.notStrictEqual(start.parts, next.parts);
    assert.strictEqual(next.parts.length, 1);
    assert.strictEqual(next.parts[0].id, 'p-1');
    assert.strictEqual(next.parts[0].fill.length, 4);
});

test('Add part adds non-colliding', tokenerator => {
    const next = tokenerator.addPart(start, tokenerator.getPart('p-2'));

    assert.notStrictEqual(start, next);
    assert.strictEqual(start.meta, next.meta);
    assert.notStrictEqual(start.parts, next.parts);
    assert.strictEqual(next.parts.length, 2);
    assert.strictEqual(next.parts[1].id, 'p-2');
    assert.strictEqual(next.parts[1].fill.length, 2);
});