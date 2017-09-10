import * as React from 'react';
import * as Icon from '../../icons';
import { Link } from 'react-router-dom';
import * as css from '../../../theme/core.scss';
import { cs } from '../../util';

export class HeroActions extends React.PureComponent<HeroActions.Properties, void> {
  render() {
    return (
      <div {...cs(css.oHeroActionsContainer)}>
        <Link to="/browse">
          <Icon.Magnifier/>
          <span>
            Browse
          </span>
        </Link>
        <Link to="/build">
          <Icon.Layers/>
          <span>
            Build
          </span>
        </Link>
      </div>
    );
  }
}

export namespace HeroActions {
  export interface Properties {

  }
}