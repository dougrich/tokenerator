import * as React from "react";

import * as css from "../../../theme/core.scss";
import { Context, contextTypes } from "../../context";
import { cs } from "../../util";

export class HeroLogo extends React.PureComponent<{}, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    return (
      <div {...cs(css.oHeaderHero)}>
        <svg viewBox="0 0 900 900">
          <defs>
            <filter id="o-logo-filter">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0"
              />
            </filter>

            <mask
              id="o-logo-mask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="100%"
              height="100%"
            >
              <g filter="url(#o-logo-filter)">
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="white"
                />
                <use
                  xlinkHref={this.context.config.staticFileNames["./static/logo.svg"] + "#--logo"}
                  transform="scale(10)"
                />
              </g>
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="white"
            mask="url(#o-logo-mask)"
          />
          </svg>
        <h1>{this.context.resources.tokenerator}</h1>
      </div>
    );
  }
}
