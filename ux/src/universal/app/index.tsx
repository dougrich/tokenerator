import { History, Location } from "history";
import * as React from "react";
import { match, Route, Switch, withRouter } from "react-router-dom";
import { CSSTransitionGroup } from "react-transition-group";

import "./browse";
import "./home";
import "./test";
import "./tokenDetails";

import "./legal";
import "./contact"

import "./error404";

import { NavHero } from "../components";
import { IconSheet } from "../icons";
import { routes } from "../route";

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
});

export namespace App {
  export interface Properties {
    match: match<any>;
    location: Location;
    history: History;
  }
}
