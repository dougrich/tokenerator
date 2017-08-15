import { Store } from './store';

Store.addReducer(function (store, action, state) {
    if (action.type === "load.details" && (!state.details || typeof(state.details) === "object" && state.details.id !== action.id)) {
        state = { ...state, details: null };
        store.data.fetch.details(action.id)
            .then(token => {
                if (token === null) {
                    store.dispatch({
                        type: "load.details.result",
                        result: "404:not-found"
                    });
                } else {
                    store.dispatch({
                        type: "load.details.result",
                        result: token
                    });
                }
            })
            .catch(err => {
                console.error(err);
                store.dispatch({
                    type: "load.details.result",
                    result: "500:error"
                });
            });
    } else if (action.type === "load.details.result") {
        state = { ...state, details: action.result };
    }
    return state;
}, "load.details", "load.details.result");


Store.addReducer(function (store, action, state) {
    if (action.type === "load.browse") {
        const browse = state.browse || [];
        if (browse.length === action.page + 1) {
            return state;
        }
        state = { ...state, browse: [...browse, null] };
        store.data.fetch.browse(action.page)
            .then(tokens => {
                store.dispatch({
                    type: "load.browse.result",
                    result: tokens
                });
            })
            .catch(err => {
                store.dispatch({
                    type: "load.browse.result",
                    result: "500:error"
                });
            });
    } else if (action.type === "load.browse.result") {
        const browse = state.browse
            .slice(0, -1);
        browse.push(action.result);
        state = { ...state, browse: browse };
    }
    return state;
}, "load.browse", "load.browse.result");