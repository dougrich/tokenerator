export interface StaticContext {
    statusCode?: number;
    title?: string;
    description?: string;
    canonical?: string;
    og?: StaticContext.OpenGraph;
}

export namespace StaticContext {
    export interface OpenGraph {
        title?: string;
        url?: string;
        description?: string;
        image?: string;
    }
}