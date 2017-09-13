import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../../theme/core.scss";
import { Context, contextTypes } from "../../context";
import * as Icon from "../../icons";
import { cs } from "../../util";

export class HeroFooter extends React.PureComponent<{}, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <div {...cs(css.oHeroFooter)}>
        <span {...cs(css.oHeroFooterCopyright)}>
          {this.context.resources.copyrightNotice}
        </span>
        <Link to="/legal">
          {this.context.resources.titleLegal}
        </Link>
        <Link to="/contact">
          {this.context.resources.titleContact}
        </Link>
      </div>
    );
  }
}
