import * as React from 'react';
import { Store, App, constants, Resources, Configuration, Context, contextTypes } from '../universal';
import * as PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Model } from '@dougrich/tokenerator';

export interface MountProperties {
  store: Store;
}

export default class Mount extends React.Component<MountProperties, void> {

  private resources: Resources;
  private configuration: Configuration;
  private parts: { [id: string]: Model.Part };

  constructor(props: MountProperties) {
    super(props);
    this.resources = JSON.parse(document.getElementById(constants.resourcesId).innerText);
    this.configuration = JSON.parse(document.getElementById(constants.configId).innerText);
    this.parts = JSON.parse(document.getElementById(constants.partId).innerText);
  }

  static childContextTypes = contextTypes;

  getChildContext() {
    return {
      store: this.props.store,
      resources: this.resources,
      config: this.configuration,
      parts: this.parts
    } as Context;
  }

  render() {
    return (
      <Router>
        <App/>
      </Router>
    );
  }
}