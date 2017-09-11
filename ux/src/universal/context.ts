import { Model } from "@dougrich/tokenerator";
import * as PropTypes from "prop-types";

import { Configuration } from "./config";
import { Resources } from "./resources";
import { Store } from "./state";

export const contextTypes = {
  config: PropTypes.object,
  parts: PropTypes.object,
  resources: PropTypes.object,
  store: PropTypes.object,
};

export interface Context {
  resources: Resources;
  config: Configuration;
  parts: { [id: string]: Model.Part };
  store: Store;
}
