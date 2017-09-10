import * as React from 'react';
import { constants, Store, Resources, Configuration, Context, contextTypes } from '../universal';
import * as PropTypes from 'prop-types';
import { Model } from '@dougrich/tokenerator';

export interface MountProperties {
  resources: Resources;
  store: Store;
  config: Configuration;
  parts: { [id: string]: Model.Part };
}

export default class Mount extends React.Component<MountProperties, void> {

  static childContextTypes = contextTypes;

  getChildContext() {
    return {
      store: this.props.store,
      resources: this.props.resources,
      config: this.props.config,
      parts: this.props.parts
    } as Context;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}