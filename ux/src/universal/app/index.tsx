import * as React from 'react';
import { Switch, Route, match, withRouter } from 'react-router-dom';
import { Location, History } from 'history';
import './tokenDetails';
import './home';
import './test';
import './error404';
import { CSSTransitionGroup } from 'react-transition-group';
import { NavHero } from '../components';
import { routes } from '../route';
import { IconSheet } from '../icons';

export const App = withRouter<{}>(
class extends React.Component<App.Properties, void> {
  render() {
    return (
      <div>
        <IconSheet/>
        <NavHero isHero={this.props.location.pathname === "/"}/>
        <Switch>
          {routes.map((R, i) => R(i.toString()))}
        </Switch>
      </div>
    );
  }
})

export namespace App {
  export interface Properties {
    match: match<any>;
    location: Location;
    history: History;
  }
}