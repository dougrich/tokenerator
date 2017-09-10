import * as React from 'react';
import * as css from './theme.scss';

export interface TokenProperties {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export class Token extends React.PureComponent<TokenProperties, any> {
  public node: HTMLDivElement;
  render() {
    return (
      <div className={css.token} ref={this.ref} onClick={this.props.onClick}/>
    );
  }

  ref = (node: HTMLDivElement) => {
    this.node = node;
  }
}