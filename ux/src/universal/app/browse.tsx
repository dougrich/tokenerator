import * as React from 'react';
import { route } from '../route';
import { Page, BrowseTileContainer } from '../components';
import { dataLoad } from '../data';
import { Model, Component } from '@dougrich/tokenerator';
import { subscribes, DataBound } from '../state';
import { Context, contextTypes } from '../context';

export default 
route({
  path: '/browse'
}, 
dataLoad(
async (store, props) => {
    store.dispatch({
        type: "load.browse",
        page: 0
    });
},
subscribes({
    browse: 'browse'
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
          canonical={'/browse'}
        >
          No tokens found!
        </Page>
      );
    } else if (page0 === "500:error") {
      return (
        <Page
          statusCode={500}
          title={"Browse"}
          canonical={'/browse'}
        >
          Error occured loading tokens!
        </Page>
      );
    } else {
      return (
        <Page
          statusCode={200}
          title={"Browse"}
          canonical={'/browse'}
        >
          {page0.map(token => (
            <BrowseTileContainer key={token.id} label={token.meta.name} tokenId={token.id}>
              <Component.Token
                token={token}
                parts={this.context.parts}
                sheet={this.context.config.staticFileNames['./static/parts.svg']}
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