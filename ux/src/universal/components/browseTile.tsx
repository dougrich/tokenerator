import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as meta from './meta';
import { Resources } from '../resources';
import { slugify } from '../util';
import { Token } from '@dougrich/tokenerator';

export interface BrowseTileProperties extends Token {
    tabIndex: number;
}

export class BrowseTile extends React.PureComponent<BrowseTileProperties, void> {

    render() {
        return <Link
            className="o-browse-tile"
            id={this.props.id}
            aria-labelledby={this.props.id + '-label'}
            {...meta.btn(() => {}, this.props.tabIndex)}
            to={`/token/${this.props.id}/${slugify(this.props.meta.name)}`}
        >
            <div/>
            <svg viewBox="0 0 90 90"/>
            <label id={this.props.id + '-label'}>{this.props.meta.name}</label>
        </Link>;
    }
}