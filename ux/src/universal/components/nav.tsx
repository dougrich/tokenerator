import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as meta from './meta';
import { Resources } from '../resources';

export interface NavbarProperties {

}

export class Navbar extends React.Component<NavbarProperties, void> {
    static contextTypes = {
        resources: PropTypes.object
    };

    context: {
        resources: Resources;
    }
    
    render() {
        return <nav className="o-navbar">
            <h1>{this.context.resources.tokenerator}</h1>
        </nav>;
    }
}