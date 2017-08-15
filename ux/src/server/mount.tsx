import * as React from 'react';
import { constants, Store, Resources } from '../universal';
import * as PropTypes from 'prop-types';
import * as http from 'http';
import * as fs from 'fs';
import { TokenStorage } from '@dougrich/tokenerator';

export interface MountProperties {
    resources: Resources;
    store: Store;
}

export default class Mount extends React.Component<MountProperties, void> {

    static childContextTypes = {
        store: PropTypes.object,
        resources: PropTypes.object
    };

    getChildContext() {
        return {
            store: this.props.store,
            resources: this.props.resources
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}