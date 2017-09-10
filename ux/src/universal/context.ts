import * as PropTypes from 'prop-types';
import { Resources } from './resources';
import { Configuration } from './config';

export const contextTypes = {
  resources: PropTypes.object,
  config: PropTypes.object
};

export interface Context {
  resources: Resources;
  config: Configuration;
}