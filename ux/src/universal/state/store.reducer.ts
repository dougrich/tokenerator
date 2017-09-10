import { Store } from './store';

const abcdef = {
    "id": "abcdef",
    "revision": 0,
    "parts": [
        {
            "id": "demon-wings",
            "variant": "$",
            "fill": {
                "p0demon-wingslayer1": "#D00",
                "p1demon-wingslayer2": "#666"
            }
        },
        {
            "id": "basic-body",
            "variant": "$",
            "fill": {
                "p0basic-bodylayer1": "#D00"
            }
        }
    ],
    "meta": {
        "name": "Example",
        "tags": [],
        "description": "Neat",
        "author": "Douglas Richardson"
    },
    "created": ""
};

const defghi = {
    "id": "defghi",
    "revision": 0,
    "parts": [
        {
            "id": "demon-wings",
            "variant": "$",
            "fill": {
                "p0demon-wingslayer1": "#D00",
                "p1demon-wingslayer2": "#666"
            }
        },
        {
            "id": "basic-body",
            "variant": "$",
            "fill": {
                "p0basic-bodylayer1": "#D00"
            }
        }
    ],
    "meta": {
        "name": "Example",
        "tags": [],
        "description": "Neat",
        "author": "Douglas Richardson"
    },
    "created": ""
};

Store.addReducer(function (store, action, state) {
    if (action.type === "load.details" && (!state.details || typeof(state.details) === "object" && state.details.id !== action.id)) {
        state = { ...state, details: null };
        if (action.id === "abcdef") {
            store.dispatch({
                type: "load.details.result",
                result: abcdef
            });
        } else if (action.id === "defghi") {
            store.dispatch({
                type: "load.details.result",
                result: defghi
            });
        }
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
        store.dispatch({
            type: "load.browse.result",
            result: [
                abcdef,
                defghi
            ]
        });
    } else if (action.type === "load.browse.result") {
        const browse = state.browse
            .slice(0, -1);
        browse.push(action.result);
        state = { ...state, browse: browse };
    }
    return state;
}, "load.browse", "load.browse.result");