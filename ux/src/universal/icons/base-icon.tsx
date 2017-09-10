import * as React from 'react';
import * as css from '../../theme/core.scss';
import { cs } from '../util';

export interface BaseIconProperties {
  iconId?: string;
  className?: string;
}

export class BaseIcon extends React.PureComponent<BaseIconProperties, any> {
  render() {
    return (
      <svg {...cs(this.props.className, css.oIcon)} viewBox="0 0 20 20">
        <use xlinkHref={"#" + this.props.iconId}/>
      </svg>
    );
  }
}