import * as PropTypes from "prop-types";
import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Model } from "@dougrich/tokenerator";
import { App, Configuration, constants, Context, contextTypes, Resources, Store } from "../universal";

export interface MountProperties {
  store: Store;
}

export default class Mount extends React.Component<MountProperties, void> {
  static childContextTypes = contextTypes;

  private resources: Resources;
  private configuration: Configuration;
  private parts: { [id: string]: Model.Part };

  constructor(props: MountProperties) {
    super(props);
    this.resources = JSON.parse(document.getElementById(constants.resourcesId).innerText);
    this.configuration = JSON.parse(document.getElementById(constants.configId).innerText);
    this.parts = JSON.parse(document.getElementById(constants.partId).innerText);
  }

  getChildContext() {
    return {
      config: this.configuration,
      parts: this.parts,
      resources: this.resources,
      store: this.props.store,
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
