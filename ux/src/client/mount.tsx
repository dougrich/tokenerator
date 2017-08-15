import * as React from 'react';
import { Store, App, constants, Resources } from '../universal';
import * as PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';

export interface MountProperties {
    store: Store;
}

export default class Mount extends React.Component<MountProperties, void> {

    private resources: Resources;

    constructor(props: MountProperties) {
        super(props);
        this.resources = JSON.parse(document.getElementById(constants.resourcesId).innerText);

    }

    static childContextTypes = {
        store: PropTypes.object,
        resources: PropTypes.object
    };

    getChildContext() {
        return {
            store: this.props.store,
            resources: this.resources
        };
    }

    render() {
        return <Router>
            <App/>
        </Router>;
    }
}