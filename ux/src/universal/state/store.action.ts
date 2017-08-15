import { Token } from '@dougrich/tokenerator';
import { DataBound } from './store.state';

export type StateAction = {
    type: 'load.details';
    id: string;
} | {
    type: 'load.details.result';
    result: DataBound<Token>;
} | {
    type: 'load.browse';
    page: number;
} | {
    type: 'load.browse.result';
    result: DataBound<Token[]>;
}