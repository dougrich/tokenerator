import { Token, Part } from '../../model';
import { editPart } from './editPart';
import { removePart } from './removePart';
export * from '../../model';
export * from './optimize';
export * from './aggregate';

export interface PartContext {
    getPart: (id: string) => Part;
}

export class Tokenerator {

    private lookup: { [id: string]: Part };

    constructor(parts: Part[]) {
        this.lookup = {};
        for (let part of parts) {
            this.lookup[part.id] = part;
        }
    }

    getPart(id: string) {
        if (!!this.lookup[id]) {
            return this.lookup[id];
        } else {
            throw new Error(`Part doesn't exist: ${id}`);
        }
    }

    editPart = editPart;
    removePart = removePart;
}

export interface TokenStorage {
    loaded: Promise<void>;
    fetch: TokenStorage.FetchAPI;
    create: TokenStorage.EditAPI;
    update: TokenStorage.EditAPI;
    delete: TokenStorage.EditAPI;
}

export namespace TokenStorage {
    export interface FetchAPI {
        browse(page: number): Promise<Token[]>;
        details(id: string): Promise<Token>;
    }
    export interface EditAPI {
        token(token: Token): Promise<Token>;
        part(part: Part): Promise<Part>;
    }
}