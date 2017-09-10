import * as React from 'react';
import * as css from './theme.scss';
import { Token } from './token';

export interface BrowseProperties {
  onNav: React.MouseEventHandler<HTMLDivElement>;
}

export class Browse extends React.PureComponent<BrowseProperties, any> {

  render() {
    return (
      <div key="browse" className={css.browse}>
        <Token onClick={this.onBrowseTokenClick}/>
        <Token onClick={this.onBrowseTokenClick}/>
        <Token onClick={this.onBrowseTokenClick}/>
      </div>
    );
  }
  
  onBrowseTokenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.top = e.currentTarget.offsetTop + 'px';
    e.currentTarget.style.left = e.currentTarget.offsetLeft + 'px';
    e.currentTarget.classList.add(css.transitioning);
    this.props.onNav(e);
  }
}