import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { subscribes, DataBound } from '../state';
import { route } from '../route';
import { dataLoad } from '../data';
import { PageMeta } from '../components';
import { BrowseList } from '../components';
import { Resources } from '../resources';
import { Configuration } from '../config';
import { Token } from '@dougrich/tokenerator';

export interface HomeProperties {
  browse: Array<DataBound<Token[]>>;
}

export default 
route({
  path: '/',
  exact: true
},
class Home extends React.Component<HomeProperties, void> {
  static contextTypes = {
    resources: PropTypes.object,
    config: PropTypes.object
  };

  context: {
    resources: Resources;
    config: Configuration;
  }

  render() {
    return (
      <PageMeta
        statusCode={200}
        canonical="/"
        preview={this.context.config.staticFileNames["./static/thumbnail.png"]}
        description="Need the perfect token for your tabletop game?"
      />
    );
  }
});