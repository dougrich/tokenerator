import * as Model from '../../../model';

export interface State {
    options: State.Options;
    token: Model.Token;
    parts: State.PartLookup;
}

export namespace State {
    export interface Options {
        /**
         * Collides parts - if true, then when a part is added that collides with the existing part, that part is removed
         */
        collide: boolean;

        /**
         * Strict z-index ordering - if true, parts are always sorted by the z-index
         * If false, changing the order of the z-index is possible
         */
        strictZOrdering: boolean;
    }

    export namespace Options {
        export const Default: Options = {
            collide: true,
            strictZOrdering: true
        };
    }

    export interface PartLookup {
        [partId: string]: Model.Part;
    }

    export namespace Action {

        export interface Add {
            type: 'token.part.add';
            partId: string;
            variant: string;
        }

        export interface Remove {
            type: 'token.part.remove';
            index: number;
        }
        
        export interface Color {
            type: 'token.part.color';
            partIndex: number;
            layerId: string;
            color: string;
        }

        export type Any = Add | Remove | Color;
    }
}