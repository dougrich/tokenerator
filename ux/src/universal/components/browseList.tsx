import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as meta from './meta';
import { BrowseTile } from './browseTile';
import { Token } from '@dougrich/tokenerator';

export interface BrowseListProperties {
    tokens: Array<Token>;
}

export class BrowseList extends React.PureComponent<BrowseListProperties, void> {

    render() {
        return <div className="o-browse-list">
            {this.props.tokens.map((token, i) => <BrowseTile key={token.id} {...token} tabIndex={i + 1}/>)}
        </div>;
    }
}