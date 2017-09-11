import * as PropTypes from "prop-types";
import * as React from "react";

import { Context, contextTypes } from "../context";
import { Store } from "./store";

/**
 * Subscribes a component to the stores
 */
class SubscribedComponent<P> extends React.Component<P, void> {
  static contextTypes = contextTypes;
  context: Context;

  constructor(
    props: P,
    context: Context,
    private stateKeys: string[],
    private lookups: { [key: string]: (store: Store) => any },
    private component: React.ComponentClass<P>,
  ) {
    super(props, context);

    const state: any = this.state = this.state || {} as any;

    this.onChange = this.onChange.bind(this);

    for (const key of stateKeys) {
      state[key] = lookups[key](context.store);
    }
  }

  componentDidMount() {
    this.context.store.subscribe(this.onChange);
  }

  componentWillUnmount() {
    this.context.store.unsubscribe(this.onChange);
  }

  onChange() {
    const newState = {};
    for (const key of this.stateKeys) {
      newState[key] = this.lookups[key](this.context.store);
    }
    this.setState(newState);
  }

  render() {
    return (
      <this.component {...this.props as any} {...this.state}/>
    );
  }
}

export function subscribes<P>(
  paths: { [id: string]: string | string[] },
  component: React.ComponentClass<P>,
) {
  const stateKeys = Object.keys(paths);
  const lookups = {};
  for (const key of stateKeys) {
    lookups[key] = Store.createLookup(paths[key]);
  }

  return class extends SubscribedComponent<P> {
    constructor(props: P, context: Context) {
      super(props, context, stateKeys, lookups, component);
    }
  };
}
