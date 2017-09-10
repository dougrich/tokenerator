import { Model } from '@dougrich/tokenerator';

export type DataBound<T> = T | "404:not-found" | "500:error";

export interface State {
    details: DataBound<Model.Token>;
    browse: Array<DataBound<Model.Token[]>>;
}