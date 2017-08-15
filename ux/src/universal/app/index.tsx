import * as React from 'react';
import { Switch, Route } from 'react-router';
import './tokenDetails';
import './home';
import './error404';
import { CSSTransitionGroup } from 'react-transition-group';
import { Navbar, IconSheet } from '../components';
import { routes } from '../route';

export const App = () => {
    return <div>
        <IconSheet/>
        <Navbar/>
        <Switch>
            {routes.map((R, i) => R(i.toString()))}
        </Switch>
    </div>;
}