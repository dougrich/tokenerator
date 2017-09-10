import * as React from 'react';
import * as Icon from '../../icons';
import { Link } from 'react-router-dom';
import * as css from '../../../theme/core.scss';
import { cs } from '../../util';

export class HeroFooter extends React.PureComponent<HeroFooter.Properties, void> {
  render() {
    return (
      <div {...cs(css.oHeroFooter)}>
        <Link to="/copyright">
          Copyright
        </Link>
        <Link to="/terms-of-service">
          Terms of Service
        </Link>
        <Link to="/contact">
          Contact
        </Link>
      </div>
    );
  }
}

export namespace HeroFooter {
  export interface Properties {

  }
}