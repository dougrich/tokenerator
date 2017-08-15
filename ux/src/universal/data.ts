import { Store } from './state';
import * as PropTypes from 'prop-types';

export type DataLoadBehavior<P> = (store: Store, props: P) => void;

export interface DataLoadClass<P> extends React.ComponentClass<P> {
    dataLoad?: DataLoadBehavior<P>;
}

export function dataLoad<P>(
    dataLoad: DataLoadBehavior<P>,
    component: React.ComponentClass<P>
): DataLoadClass<P> {

    return class extends component {
        static dataLoad = dataLoad;
        static contextTypes = {
            store: PropTypes.object
        };

        context: {
            store: Store;
        };

        componentDidMount() {
            dataLoad(this.context.store, this.props);
            if (super.componentDidMount) {
                super.componentDidMount();
            }
        }

        componentWillReceiveProps(nextProps: P, nextContext) {
            dataLoad(this.context.store, this.props);
            if (super.componentWillReceiveProps) {
                super.componentWillReceiveProps(nextProps, nextContext);
            }
        }
    }
}