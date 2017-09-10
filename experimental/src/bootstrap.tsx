import * as React from "react";
import * as ReactDOM from "react-dom";
import { CSSTransitionGroup } from 'react-transition-group';
import * as css from "./theme.scss";
import { Token } from './token';
import { Browse } from './browse';

interface AppState {
  expanded: boolean;
}

class App extends React.Component<any, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  render() {
    return (
      <div className="shell">
        <CSSTransitionGroup
          transitionName={css}
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={500}
        >
          {this.state.expanded
            ? (
              <div key="details" className={css.details}>
                <Token onClick={this.setState.bind(this, { expanded: false }, null)}/>
              </div>
            )
            : (<Browse key="browse" onNav={this.setState.bind(this, { expanded: true })}/>)}
        </CSSTransitionGroup>
      </div>
    );
  }
}

let mount = document.getElementById("mount-point");
if (!mount) {
  mount = document.createElement('div');
  document.body.appendChild(mount);
}

ReactDOM.render((<App/>), mount);