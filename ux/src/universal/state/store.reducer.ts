import { Store } from "./store";

Store.addReducer((store, action, state) => {
  if (action.type === "load.details"
    && (
      !state.details
      || typeof(state.details) === "object"
      && state.details.id !== action.id)) {

    state = { ...state, details: null };
    if (action.id === "abcdef") {
      store.dispatch({
        result: null,
        type: "load.details.result",
      });
    } else if (action.id === "defghi") {
      store.dispatch({
        result: null,
        type: "load.details.result",
      });
    }
  } else if (action.type === "load.details.result") {
    state = { ...state, details: action.result };
  }
  return state;
}, "load.details", "load.details.result");

Store.addReducer((store, action, state) => {
  if (action.type === "load.browse") {
    const browse = state.browse || [];
    if (browse.length === action.page + 1) {
      return state;
    }
    state = { ...state, browse: [...browse, null] };
    store.dispatch({
      result: [
        null,
        null,
      ],
      type: "load.browse.result",
    });
  } else if (action.type === "load.browse.result") {
    const browse = state.browse
      .slice(0, -1);
    browse.push(action.result);
    state = { ...state, browse };
  }
  return state;
}, "load.browse", "load.browse.result");
