import * as React from "react";
import { match, matchPath, Route, RouteProps } from "react-router";

import { DataLoadClass } from "./data";
import { Store } from "./state";

export const routes: Array<(key: string) => React.ReactElement<RouteProps>> = [];

export function route<P>(
  routeProps: RouteProps,
  component: DataLoadClass<{ match?: match<P> }>,
) {

  if (!IS_CLIENT) {
    Store.addMount(async (pathname, store) => {
      const match = matchPath<P>(pathname, routeProps);
      if (!!match && component.dataLoad) {
        await component.dataLoad(store, { match });
      }
    });
  }

  routes.push((key) => (
    <Route
      key={key}
      {...routeProps}
      component={component as any}
    />
  ));

  return component;
}
