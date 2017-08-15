export interface Token {
    id: string;
    revision: number;
    parts: Token.Part[];
    meta: Token.Meta;
    created: string;
}

export namespace Token {
    export interface Meta {
        name: string;
        tags: string[];
        description: string;
        author: string;
    }

    export interface Part {
        id: string;
        variant?: number;
        fill: string[];
    }
}