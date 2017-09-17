import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../theme/core.scss";
import { Page } from "../components";
import { Context, contextTypes } from "../context";
import { route } from "../route";
import { cs } from "../util";

export default
route({
  exact: true,
  path: "/legal",
},
class LegalPage extends React.Component<{}, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <Page
        statusCode={200}
        title={this.context.resources.titleLegal}
        canonical="/legal"
      >
        <div {...cs(css.oPageContainer)}>
          <h1>{this.context.resources.titleLegalPages}</h1>
          <ul>
            <li><Link to="/legal/terms-of-service">{this.context.resources.titleTerms}</Link></li>
            <li><Link to="/legal/privacy">{this.context.resources.titlePrivacy}</Link></li>
            <li><Link to="/legal/acknowledgements">{this.context.resources.titleAcknowledgements}</Link></li>
          </ul>
        </div>
      </Page>
    );
  }
});
