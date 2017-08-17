export interface Part {
    id: string;
    meta: Part.Meta;
    availability: Part.Availability;
    svg: Part.SVG;
    variants: Part.VariantCollection;
    zIndex: number;
}

export namespace Part {
    export interface Meta {
        name: string;
        tags: string[];
        description: string;
        author: string;
    }

    export type Availability = [string, string];

    export interface SVG {
        defs: Array<string>;
        layers: Array<string>;
    }

    export interface VariantCollection {
        [key: string]: Variant;
    }

    export interface Variant {
        collisionSlots: number;
        transform: string;
    }
}