import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../theme/core.scss";
import { Context, contextTypes } from "../context";
import { route } from "../route";
import { cs } from "../util";

export default
route({
  path: "/legal",
},
class LegalPage extends React.Component<{}, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <div {...cs(css.oPage)}>
        <div {...cs(css.oPageContainer)}>
          <h1>{this.context.resources.titleLegalPages}</h1>
          <ul>
            <li><Link to="terms-of-use">{this.context.resources.titleTerms}</Link></li>
            <li><Link to="privacy">{this.context.resources.titlePrivacy}</Link></li>
            <li><Link to="acknowledgements">{this.context.resources.titleAcknowledgements}</Link></li>
          </ul>
        </div>
      </div>
    );
  }
});
