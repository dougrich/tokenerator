import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../../theme/core.scss";
import { Context, contextTypes } from '../../context';
import * as Icon from "../../icons";
import { cs } from "../../util";

export class HeroFooter extends React.PureComponent<{}, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <div {...cs(css.oHeroFooter)}>
        <Link to="/copyright">
          {this.context.resources.titleCopyright}
        </Link>
        <Link to="/terms-of-service">
          {this.context.resources.titleTermsOfService}
        </Link>
        <Link to="/contact">
          {this.context.resources.titleContact}
        </Link>
      </div>
    );
  }
}
