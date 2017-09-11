import * as PropTypes from "prop-types";
import * as React from "react";
import { Link } from "react-router-dom";

import { Page } from "../components";
import { Configuration } from "../config";
import { Context, contextTypes } from "../context";
import { dataLoad } from "../data";
import { Resources } from "../resources";
import { route } from "../route";
import { DataBound, subscribes } from "../state";

export default
route({
  exact: true,
  path: "/",
},
class Home extends React.Component<{}, void> {
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
