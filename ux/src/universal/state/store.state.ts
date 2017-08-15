import { Token } from '@dougrich/tokenerator';

export type DataBound<T> = T | "404:not-found" | "500:error";

export interface State {
    details: DataBound<Token>;
    browse: Array<DataBound<Token[]>>;
}