export interface Part {
    id: string;
    raw: Part.SVG;
    optimized: Part.SVG;
    meta: Part.Meta;
    rendering: Part.Rendering;
    availability: Part.Availability;
    variants: Array<Part.Variant>;
    layers: number;
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
        hash: string;
        document: string;
    }

    export interface Rendering {
        zIndex: number;
        collisionSlots: number;
    }

    export interface Variant {
        transform: string;
        rendering: Part.Rendering;
    }
}