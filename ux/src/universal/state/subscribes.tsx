import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Store } from './store';

interface SubscribedComponentContext {
    store: Store;
}

/**
 * Subscribes a component to the stores
 */
class SubscribedComponent<P> extends React.Component<P, void> {
    static contextTypes = {
        store: PropTypes.object
    };

    context: SubscribedComponentContext;

    constructor(
        props: P,
        context: SubscribedComponentContext,
        private stateKeys: string[],
        private lookups: { [key: string]: Function },
        private component: React.ComponentClass<P>
    ) {
        super(props, context);
        
        const state: any = this.state = this.state || {} as any;

        this.onChange = this.onChange.bind(this);

        for (let i = 0; i < stateKeys.length; i++) {
            state[stateKeys[i]] = lookups[stateKeys[i]](context.store);
        }
    }

    componentDidMount() {
        this.context.store.subscribe(this.onChange);
    }

    componentWillUnmount() {
        this.context.store.unsubscribe(this.onChange);
    }

    onChange() {
        const newState = {};
        for (let i = 0; i < this.stateKeys.length; i++) {
            newState[this.stateKeys[i]] = this.lookups[this.stateKeys[i]](this.context.store);
        }
        this.setState(newState);
    }

    render() {
        return <this.component {...this.props as any} {...this.state}/>
    }
}


export function subscribes<P>(
    paths: { [id: string]: string | string[] },
    component: React.ComponentClass<P>
) {
    const stateKeys = Object.keys(paths);
    const lookups = {};
    for (let i = 0; i < stateKeys.length; i++) {
        lookups[stateKeys[i]] = Store.createLookup(paths[stateKeys[i]]);
    }

    return class extends SubscribedComponent<P> {
        constructor(props: P, context: SubscribedComponentContext) {
            super(props, context, stateKeys, lookups, component);
        }
    }
}