import { Tokenerator } from '../lib';
/*
const instance = new Tokenerator([
    {
        id: 'p-0',
        raw: {
            hash: '',
            document: ''
        },
        optimized: {
            hash: '',
            document: ''
        },
        layers: 4,
        meta: {
            name: 'test-body',
            tags: [],
            description: '',
            author: ''
        },
        rendering: {
            zIndex: 0,
            collisionSlots: 1
        },
        availability: [null, null],
        variants: []
    },
    {
        id: 'p-1',
        raw: {
            hash: '',
            document: ''
        },
        optimized: {
            hash: '',
            document: ''
        },
        layers: 4,
        meta: {
            name: 'test-body-1',
            tags: [],
            description: '',
            author: ''
        },
        rendering: {
            zIndex: 0,
            collisionSlots: 1
        },
        availability: [null, null],
        variants: []
    },
    {
        id: 'p-2',
        raw: {
            hash: '',
            document: ''
        },
        optimized: {
            hash: '',
            document: ''
        },
        layers: 2,
        meta: {
            name: 'test-weapon',
            tags: [],
            description: '',
            author: ''
        },
        rendering: {
            zIndex: 0,
            collisionSlots: 2
        },
        availability: [null, null],
        variants: []
    }
]);

let passed: number = 0;
let failed: string[] = [];
export function test(name: string, behavior: (_: Tokenerator) => void) {
    try {
        behavior(instance);
        passed++;
        console.log(`passed: ${name}`);
    } catch (err) {
        console.error(`FAILED: ${name}`);
        console.error(err);
        failed.push(name);
    }
}

export function summarize() {
    console.log(`passed: ${passed}`);
    if (failed.length) {
        console.log(`FAILED: ${failed.length}`);
        for (let i = 0; i < failed.length; i++) {
            console.log(`  ${failed[i]}`);
        }
        process.exit(-1);
    } else {
        process.exit(0);
    }
}*/