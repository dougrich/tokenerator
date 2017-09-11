import * as PropTypes from "prop-types";
import * as React from "react";

import { Model } from "@dougrich/tokenerator";
import { Configuration, constants, Context, contextTypes, Resources, Store } from "../universal";

export interface MountProperties {
  config: Configuration;
  parts: { [id: string]: Model.Part };
  resources: Resources;
  store: Store;
}

export default class Mount extends React.Component<MountProperties, void> {

  static childContextTypes = contextTypes;

  getChildContext() {
    return {
      config: this.props.config,
      parts: this.props.parts,
      resources: this.props.resources,
      store: this.props.store,
    } as Context;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
