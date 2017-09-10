import * as React from 'react';
import { Store, App, constants, Resources, Configuration } from '../universal';
import * as PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export interface MountProperties {
    store: Store;
}

export default class Mount extends React.Component<MountProperties, void> {

    private resources: Resources;
    private configuration: Configuration;

    constructor(props: MountProperties) {
        super(props);
        this.resources = JSON.parse(document.getElementById(constants.resourcesId).innerText);
        this.configuration= JSON.parse(document.getElementById(constants.configId).innerText);
    }

    static childContextTypes = {
        store: PropTypes.object,
        resources: PropTypes.object,
        config: PropTypes.object
    };

    getChildContext() {
        return {
            store: this.props.store,
            resources: this.resources,
            config: this.configuration
        };
    }

    render() {
        return <Router>
            <App/>
        </Router>;
    }
}