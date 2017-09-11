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
  console.log('FETCHING DATA');
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
    console.log(this.props.browse);
    const page0 = (this.props.browse || [])[0];

    if (!page0 || page0 === "404:not-found") {
      return (
        <Page
          statusCode={404}
          title={this.context.resources.titleBrowse}
          canonical='/browse'
        >
          No tokens found!
        </Page>
      );
    } else if (page0 === "500:error") {
      return (
        <Page
          statusCode={500}
          title={this.context.resources.titleBrowse}
          canonical='/browse'
        >
          Error occured loading tokens!
        </Page>
      );
    } else {
      return (
        <Page
          statusCode={200}
          title={this.context.resources.titleBrowse}
          canonical='/browse'
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