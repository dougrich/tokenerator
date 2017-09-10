import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { subscribes, DataBound } from '../state';
import { route } from '../route';
import { dataLoad } from '../data';
import { Page } from '../components';
import { Resources } from '../resources';
import { Configuration } from '../config';
import { Context, contextTypes } from '../context';

export default 
route({
  path: '/',
  exact: true
},
class Home extends React.Component<Home.Properties, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <Page
        statusCode={200}
        canonical="/"
        preview={this.context.config.staticFileNames["./static/thumbnail.png"]}
        description="Need the perfect token for your tabletop game?"
      />
    );
  }
});

export namespace Home {
  export interface Properties {

  }
}