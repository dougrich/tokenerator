import { StateAction } from "./store.action";
import { State } from "./store.state";

export type MountBehavior = (pathname: string, store: Store) => Promise<void>;
export type ReducerBehavior = (store: Store, action: StateAction, state: State) => State;

export class Store {

  /**
   * Adds bootstrapping logic that will be fired once on startup - useful for populating the initial store
   * @param behavior The logic when mounting the store
   */
  static addMount(behavior: MountBehavior) {
    this.mounts.push(behavior);
  }

  /**
   * Adds a reducer to the store
   * @param reducer The reducer to add
   * @param actions The actions that the reducer will fire for - if empty, all actions
   */
  static addReducer(reducer: ReducerBehavior, ...actions: string[]) {
    if (actions.length > 0) {
      actions.forEach((action) => {
        Store.boundReducers[action] = Store.boundReducers[action] || [];
        Store.boundReducers[action].push(reducer);
      });
    } else {
      Store.reducers.push(reducer);
    }
  }

  /**
   * Bootstraps a store inside of a given context
   * @param context Context to execute in - should match that of the mount behaviors
   */
  static async bootstrap(pathname: string, initial?: State) {
    const store = new Store(initial);
    await store.init(pathname);
    return store;
  }

  /**
   * Creates a lookup function which will lookup part of the store
   * @param path Path to the value to lookup
   */
  static createLookup(path: string | string[]) {
    if (typeof path === "string") {
      path = path.split(".");
    }
    path = path.reverse();
    return (store: Store) => {
      let i = path.length;
      let lookup = store.state;
      while (i--) {
        const next = lookup[path[i]];
        if (next != null) {
          lookup = next;
        } else {
          return next;
        }
      }
      return lookup;
    };
  }

  /**
   * List of logic to execute on startup
   */
  private static mounts: MountBehavior[] = [];

  /**
   * List of reducers to execute on each dispatch
   */
  private static reducers: ReducerBehavior[] = [];

  /**
   * Dictionary of reducers to fire on specific events - this fire after all other reducers
   */
  private static boundReducers: { [id: string]: ReducerBehavior[] } = {};

  /**
   * The current state
   */
  state: State;

  /**
   * Collection of listeners to notify of state changes
   */
  private listeners: Array<() => void> = [];

  /**
   * List of actions to evaluate
   */
  private actionQueue: StateAction[] = null;

  /**
   * Creates a new store instance
   * @param context Anything - on the server, this will include the request, on the client, the initial state
   */
  private constructor(
    state: State = {
      browse: null,
      details: null,
    },
  ) {
    this.state = state;
  }

  async init(pathname: string) {
    // get the initial states
    for (const mount of Store.mounts) {
      await mount(pathname, this);
    }
  }

  /**
   * Dispatches a set of events synchronously
   * @param actions List of actions to execute; multiple actions will be executed as part of the same change
   */
  dispatch(...actions: StateAction[]) {
    // check if we"re already in a dispatch
    if (this.actionQueue != null) {

      // we"re currently in a dispatch; append to the current execution chain
      this.actionQueue = this.actionQueue.concat(actions);

    } else {

      // this is a fresh event; grab the start and create a next variable
      const start = this.state;
      let next = this.state;

      // note our current list of actions
      this.actionQueue = actions;

      // iterate through the list of actions - any dispatches called inside of a reducer will add to the action queue
      for (const action of this.actionQueue) {
        for (const reducer of Store.reducers) {
          next = reducer.apply(this, [this, action, next]);
        }
        const additionalReducers = Store.boundReducers[action.type];
        if (!!additionalReducers) {
          for (const reducer of additionalReducers) {
            next = reducer.apply(this, [this, action, next]);
          }
        }
      }

      // check if we have changed state; if so, notify our listeners
      if (next !== start) {
        this.state = next;
        for (const listener of this.listeners) {
          listener();
        }
      }

      // clears the current dispatch
      this.actionQueue = null;
    }
  }

  /**
   * Equivalent of dispatch, however it is done on the next tick
   * @param actions List of actions to execute; see dispatch.actions
   */
  dispatchAsync(...actions: StateAction[]) {
    setTimeout(this.createDispatcher.apply(this, actions));
  }

  /**
   * Creates a dispatcher - useful for callbacks to onclick events
   * @param actions List of actions to execute; see dispatch.actions
   */
  createDispatcher(...actions: StateAction[]) {
    return this.dispatch.bind(this, actions);
  }

  /**
   * Creates a dispatcher that when called is asynchronous - useful for deferred callbacks
   * @param actions List of actions to execute; see dispatch.actions
   */
  createAsyncDispatcher(...actions: StateAction[]) {
    return this.dispatchAsync.bind(this, actions);
  }

  subscribe(onChange) {
    this.listeners.push(onChange);
  }

  unsubscribe(onChange) {
    const i = this.listeners.indexOf(onChange);
    this.listeners.splice(i, 1);
  }
}
