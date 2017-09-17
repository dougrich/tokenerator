import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../theme/core.scss";
import { Page } from "../components";
import { Context, contextTypes } from "../context";
import { route } from "../route";
import { cs } from "../util";

function createStaticPage(path: string, backpath: string, titleName: string, staticFileName: string) {
  route({
    path,
  },
  class StaticPage extends React.Component<{}, void> {
    static contextTypes = contextTypes;
    context: Context;

    render() {
      return (
        <Page
          statusCode={200}
          title={this.context.resources[titleName]}
          canonical={path}
        >
          <Link {...cs(css.oBackLink)} to={backpath}>{this.context.resources.back}</Link>
          <iframe src={this.context.config.staticFileNames[staticFileName]}/>
        </Page>
      );
    }
  });
}

createStaticPage("/legal/terms-of-service", "/legal", "titleTerms", "./static/pages/terms-of-service.md");
createStaticPage("/legal/acknowledgements", "/legal", "titleAcknowledgements", "./static/pages/acknowledgements.md");
createStaticPage("/legal/privacy", "/legal", "titlePrivacy", "./static/pages/privacy-policy.md");
