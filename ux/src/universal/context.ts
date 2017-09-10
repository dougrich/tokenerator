import * as PropTypes from 'prop-types';
import { Resources } from './resources';
import { Configuration } from './config';
import { Store } from './state';
import { Model } from '@dougrich/tokenerator';

export const contextTypes = {
  store: PropTypes.object,
  resources: PropTypes.object,
  config: PropTypes.object,
  parts: PropTypes.object
};

export interface Context {
  resources: Resources;
  config: Configuration;
  parts: { [id: string]: Model.Part };
  store: Store;
}