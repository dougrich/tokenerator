import { TokenStorage, Token, Part } from '@dougrich/tokenerator';
import * as fs from 'fs';

export class DataAccess implements TokenStorage {
    loaded: Promise<void> = Promise.resolve();
    private tokens: Token[];
    private parts: Part[];
    
    fetch: TokenStorage.FetchAPI;
    create: TokenStorage.EditAPI;
    update: TokenStorage.EditAPI;
    delete: TokenStorage.EditAPI;

    constructor() {
        try {
            const { tokens, parts } = JSON.parse(fs.readFileSync('storage.json', 'utf8'));
            this.tokens = tokens;
            this.parts = parts;
        } catch (err) {
            this.tokens = [];
            this.parts = [];
        }

        this.fetch = {
            browse: (page: number) => {
                return this.do(new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(this.tokens.slice(10 * page, 10 * (page + 1)));
                    }, 400);
                }));
            },
            details: (id: string) => {
                return this.do(new Promise((resolve, reject) => {
                    setTimeout(() => {
                        for (let i = 0; i < this.tokens.length; i++) {
                            if (this.tokens[i].id === id) {
                                return resolve(this.tokens[i]);
                            }
                        }
                        return resolve(null);
                    }, 400);
                }));
            }
        };
    }

    private do<T>(promise: Promise<T>): Promise<T> {
        this.loaded = Promise.all([
            promise.catch(err => {}),
            this.loaded
        ]).then(() => {});

        return promise;
    }
    
}