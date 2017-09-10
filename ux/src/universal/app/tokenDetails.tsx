import * as React from 'react';
import { Link, match } from 'react-router-dom';
import { subscribes, DataBound } from '../state';
import { route } from '../route';
import { dataLoad } from '../data';
import { Page } from '../components';
import { Model, Component } from '@dougrich/tokenerator';
import { slugify } from '../util';
import { Context, contextTypes } from '../context';
import * as css from '../../theme/core.scss';
import { cs } from '../util';

export interface TokenDetailsProperties {
    match: match<{
        id: string;
    }>;
    details: DataBound<Model.Token>
}

export default
route({
    path: '/token/:id/:name?'
},
dataLoad(
async (store, props) => {
    store.dispatch({
        type: "load.details",
        id: props.match.params.id
    });
},
subscribes({
    details: 'details'
},
class TokenDetails extends React.Component<TokenDetailsProperties, void> {
    static contextTypes = contextTypes;
    context: Context;

    render() {
        if (this.props.details === "404:not-found") {
            return (
                <Page
                    statusCode={404}
                    title={"Oh no!"}
                    canonical={`/tokens/${this.props.match.params.id}`}
                >
                    <h1>Not Found</h1>
                </Page>
            );
        } else if (this.props.details === "500:error") {
            return (
                <Page
                    statusCode={500}
                    title={"Oh no!"}
                    canonical={`/tokens/${this.props.match.params.id}`}
                >
                    <h1>Error</h1>
                </Page>
            );
        } else if (this.props.details) {
            return (
                <Page
                    title={this.props.details.meta.name}
                    description={this.props.details.meta.description}
                    preview={`/preview.png`}
                    canonical={`/tokens/${this.props.details.id}/${slugify(this.props.details.meta.name)}`}
                >
                    <div {...cs(css.oDetails)}>
                        <Component.Token
                            {...cs(css.oDetailsToken)}
                            token={this.props.details}
                            parts={this.context.parts}
                            sheet={this.context.config.staticFileNames['./static/parts.svg']}
                        />
                        <h1>{this.props.details.meta.name}</h1>
                    </div>
                </Page>
            );
        } else {
            return (
                <Page
                    title={"Loading..."}
                    canonical={`/tokens/${this.props.match.params.id}`}
                >
                    <h1>Loading</h1>
                </Page>
            );
        }
    }
})));