import * as React from 'react';
import { cs } from '../../util';
import * as css from '../../../theme/core.scss';

export interface ActionTriggerContainerProperties {
  className?: string;
}

export class ActionTriggerContainer extends React.PureComponent<ActionTriggerContainerProperties, void> {
  render() {
    return (
      <div {...cs(this.props.className, css.oActionTriggerContainer)}>
        {this.props.children}
      </div>
    );
  }
}

export interface ActionTriggerProperties {
  className?: string;
  type: ActionTriggerProperties.ActionType,
  icon: React.ReactNode,
  label: string
}

export namespace ActionTriggerProperties {
  export enum ActionType {
    Positive,
    Negative,
    Disabled
  }

  export const ActionTypeClassName = {
    [ActionType.Positive]: css.isPositiveAction,
    [ActionType.Negative]: css.isNegativeAction,
    [ActionType.Disabled]: css.isDisabledAction
  }
}

export class ActionTrigger extends React.PureComponent<ActionTriggerProperties, void> {
  render() {
    return (
      <button
        {...cs(this.props.className, ActionTriggerProperties.ActionTypeClassName[this.props.type], css.oActionTrigger)}
        disabled={this.props.type === ActionTriggerProperties.ActionType.Disabled}
      >
        {this.props.icon}
        <span>
          {this.props.label}
        </span>
      </button>
    );
  }
}