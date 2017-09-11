import * as React from "react";
import { Link } from "react-router-dom";

import * as css from "../../theme/core.scss";
import { ActionTrigger, ActionTriggerContainer, ActionTriggerProperties, BrowseTileContainer } from "../components";
import * as Icon from "../icons";
import { route } from "../route";

export default
route({
  path: "/test",
},
class TestPage extends React.Component<{}, void> {
  render() {
    return (
      <div style={{margin: "20px"}}>
        <h1>Tokenerator UX</h1>
        <div>
          <h2>Typography</h2>
          <div>
            <h1>Header 1</h1>
            <h2>Header 2</h2>
            <h3>Header 3</h3>
            <h4>Header 4</h4>
            <h5>Header 5</h5>
          </div>
        </div>
        <div>
          <h2>Action Trigger</h2>
          <ActionTriggerContainer>
            <ActionTrigger
              type={ActionTriggerProperties.ActionType.Positive}
              icon={<Icon.Upload/>}
              label="Okay"
            />
            <ActionTrigger
              type={ActionTriggerProperties.ActionType.Negative}
              icon={<Icon.Cross/>}
              label="Cancel"
            />
            <ActionTrigger
              type={ActionTriggerProperties.ActionType.Disabled}
              icon={<Icon.Bug/>}
              label="Nope"
            />
          </ActionTriggerContainer>
        </div>
        <div>
          <h2>Browse Page Interaction</h2>
          <BrowseTileContainer label="testtesttesttesttesttesttesttesttesttesttesttest" tokenId="abc">
            <div className={css.oTokenPlaceholder}/>
          </BrowseTileContainer>
          <BrowseTileContainer label="test" tokenId="abc2">
            <div className={css.oTokenPlaceholder}/>
          </BrowseTileContainer>
          <BrowseTileContainer label="test" tokenId="abc3">
            <div className={css.oTokenPlaceholder}/>
          </BrowseTileContainer>
        </div>
      </div>
    );
  }
});
