import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as meta from './meta';
import { Context, contextTypes } from '../context';
import * as Icon from '../icons';
import * as css from '../../theme/core.scss';
import { cs } from '../util';
import { HeroBackground, HeroLogo, HeroActions, HeroFooter } from './hero';
import { Scrollbars } from 'react-custom-scrollbars';
import { CSSTransitionGroup } from 'react-transition-group';

export class NavHero extends React.Component<NavHero.Properties, void> {
  static contextTypes = contextTypes;

  context: Context;
  
  render() {
    return (
      <nav {...cs(css.oNavbar, { [css.isHero]: this.props.isHero })}>
        <CSSTransitionGroup
          transitionName={{
            enter: css.oHeroTransitionEnter,
            enterActive: css.oHeroTransitionEnterActive,
            leave: css.oHeroTransitionLeave,
            leaveActive: css.oHeroTransitionLeaveActive
          }}
          transitionEnterTimeout={1500}
          transitionLeaveTimeout={1500}
        >
        {this.props.isHero && [
          <HeroBackground key="o-hero-bg"/>,
          <Scrollbars
            {...cs(css.oHeroContainer)}
            renderThumbVertical={this.renderThumb}
            key="o-hero-container"
          >
            <HeroLogo/>
            <HeroActions/>
            <HeroFooter/>
          </Scrollbars>
        ]}
        </CSSTransitionGroup>
      </nav>
    );
  }

  private renderThumb({ style, ...props}) {
    return (
      <div
        {...cs(css.oHeroScrollThumb)}
        style={style}
        {...props}
      />
    );
  }
}

export namespace NavHero {
  export interface Properties {
    isHero?: boolean;
  }
}