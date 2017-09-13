import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../theme/core.scss";
import { Page } from "../components";
import { Context, contextTypes } from "../context";
import { route } from "../route";
import { cs } from "../util";

export default
route({
  path: "/contact",
},
class ContactPage extends React.Component<{}, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <Page
        statusCode={200}
        title={this.context.resources.titleContact}
        canonical="/contact"
      >
        <div {...cs(css.oPageContainer)}>
          <h1>Ways to get in touch</h1>
        </div>
      </Page>
    );
  }
});
