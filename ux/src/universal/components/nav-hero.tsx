import * as PropTypes from "prop-types";
import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import { CSSTransitionGroup } from "react-transition-group";

import * as css from "../../theme/core.scss";
import { Context, contextTypes } from "../context";
import * as Icon from "../icons";
import { cs } from "../util";
import { HeroActions, HeroBackground, HeroFooter, HeroLogo } from "./hero";
import * as meta from "./meta";

export class NavHero extends React.Component<NavHero.Properties, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {

    const transitionName = {
      enter: css.oHeroTransitionEnter,
      enterActive: css.oHeroTransitionEnterActive,
      leave: css.oHeroTransitionLeave,
      leaveActive: css.oHeroTransitionLeaveActive,
    };

    const children =
      this.props.isHero && [
        (<HeroBackground key="o-hero-bg"/>),
        (
          <Scrollbars
            {...cs(css.oHeroContainer)}
            renderThumbVertical={this.renderThumb}
            key="o-hero-container"
          >
            <HeroLogo/>
            <HeroActions/>
            <HeroFooter/>
          </Scrollbars>
        ),
      ];

    return (
      <nav {...cs(css.oNavbar, { [css.isHero]: this.props.isHero })}>
        <CSSTransitionGroup
          transitionName={transitionName}
          transitionEnterTimeout={1500}
          transitionLeaveTimeout={1500}
        >
          {children}
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
