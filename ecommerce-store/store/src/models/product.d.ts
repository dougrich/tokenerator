export interface Product {
    id: string; // unique product id
    meta: Product.Meta; // metadata about the product
    
}

export namespace Product {
    export interface Meta {
        name: string;
        tags: string[];
        description: string;
    }
}