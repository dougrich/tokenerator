import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../../theme/core.scss";
import { cs, slugify } from "../../util";

export class BrowseTileContainer extends React.PureComponent<BrowseTileContainer.Properties, void> {
  render() {
    const { tokenId, className, label, children } = this.props;
    const labelId = tokenId + "-label";

    return (
      <Link
        {...cs(css.oBrowseTileContainer, className)}
        id={tokenId}
        to={`/token/${tokenId}/${slugify(label)}`}
        aria-labelledby={labelId}
      >
        {children}
        {!!label && (
          <label id={labelId}>
            {label}
          </label>
        )}
      </Link>
    );
  }
}

export namespace BrowseTileContainer {
  export interface Properties {
    label: string;
    tokenId: string;
    className?: string;
  }
}
