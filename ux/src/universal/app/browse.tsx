import * as React from "react";

import { Component, Model } from "@dougrich/tokenerator";
import { BrowseTileContainer, Page } from "../components";
import { Context, contextTypes } from "../context";
import { dataLoad } from "../data";
import { route } from "../route";
import { DataBound, subscribes } from "../state";

export default
route({
  path: "/browse",
},
dataLoad(
async (store, props) => {
    store.dispatch({
        page: 0,
        type: "load.browse",
    });
},
subscribes({
    browse: "browse",
},
class Browse extends React.Component<Browse.Properties, void> {
  static contextTypes = contextTypes;
  context: Context;

  render() {
    const page0 = (this.props.browse || [])[0];

    if (!page0 || page0 === "404:not-found") {
      return (
        <Page
          statusCode={404}
          title={"Browse"}
          canonical={"/browse"}
        >
          No tokens found!
        </Page>
      );
    } else if (page0 === "500:error") {
      return (
        <Page
          statusCode={500}
          title={"Browse"}
          canonical={"/browse"}
        >
          Error occured loading tokens!
        </Page>
      );
    } else {
      return (
        <Page
          statusCode={200}
          title={"Browse"}
          canonical={"/browse"}
        >
          {page0.map(token => (
            <BrowseTileContainer key={token.id} label={token.meta.name} tokenId={token.id}>
              <Component.Token
                token={token}
                parts={this.context.parts}
                sheet={this.context.config.staticFileNames["./static/parts.svg"]}
              />
            </BrowseTileContainer>
          ))}
        </Page>
      );
    }
  }
})));

export namespace Browse {
  export interface Properties {
    browse: Array<DataBound<Model.Token[]>>;
  }
}
