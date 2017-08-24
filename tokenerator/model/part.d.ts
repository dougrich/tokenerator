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

    export type Availability = [number, number];

    export interface SVG {
        defs: string;
        layers: Layer[];
    }

    export interface Layer {
        id: string;
        markup: string;
        defaultStyles: LayerDefaultStyles;
    }

    export interface LayerDefaultStyles {
        fill?: string;
    }

    export interface VariantCollection {
        [key: string]: Variant;
    }

    export interface Variant {
        collisionSlots: number;
        transform: string;
    }
}