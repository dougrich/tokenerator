import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../../theme/core.scss";
import { Context, contextTypes } from "../../context";
import * as Icon from "../../icons";
import { cs } from "../../util";

export class HeroActions extends React.PureComponent<{}, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <div {...cs(css.oHeroActionsContainer)}>
        <Link to="/browse">
          <Icon.Magnifier/>
          <span>
            {this.context.resources.titleBrowse}
          </span>
        </Link>
        <Link to="/build">
          <Icon.Layers/>
          <span>
            {this.context.resources.titleBuild}
          </span>
        </Link>
      </div>
    );
  }
}
