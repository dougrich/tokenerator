import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { constants, Store } from "../universal";
import Mount from "./mount";

// dif
(async function() {
    const store = await Store.bootstrap(location.pathname, JSON.parse(document.getElementById(constants.stateId).innerText));
    const mount = document.getElementById(constants.mountId);
    ReactDOM.render(<Mount store={store}/>, mount);
})();
