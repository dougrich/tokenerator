import { Model } from "@dougrich/tokenerator";
import { DataBound } from "./store.state";

export type StateAction = {
    type: "load.details";
    id: string;
} | {
    type: "load.details.result";
    result: DataBound<Model.Token>;
} | {
    type: "load.browse";
    page: number;
} | {
    type: "load.browse.result";
    result: DataBound<Model.Token[]>;
};
