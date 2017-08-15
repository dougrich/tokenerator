import * as React from 'react';
import { Link, match } from 'react-router-dom';
import { subscribes, DataBound } from '../state';
import { route } from '../route';
import { dataLoad } from '../data';
import { PageMeta } from '../components';
import { Token } from '@dougrich/tokenerator';
import { slugify } from '../util';

export interface TokenDetailsProperties {
    match: match<{
        id: string;
    }>;
    details: DataBound<Token>
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
    render() {
        if (this.props.details === "404:not-found") {
            return (
                <PageMeta
                    statusCode={404}
                    title={"Oh no!"}
                    canonical={`/tokens/${this.props.match.params.id}`}
                >
                    <h1>Not Found</h1>
                </PageMeta>
            );
        } else if (this.props.details === "500:error") {
            return (
                <PageMeta
                    statusCode={500}
                    title={"Oh no!"}
                    canonical={`/tokens/${this.props.match.params.id}`}
                >
                    <h1>Error</h1>
                </PageMeta>
            );
        } else if (this.props.details) {
            return (
                <PageMeta
                    title={this.props.details.meta.name}
                    description={this.props.details.meta.description}
                    preview={`/preview.png`}
                    canonical={`/tokens/${this.props.details.id}/${slugify(this.props.details.meta.name)}`}
                >
                    <h1>{this.props.details.meta.name}</h1>
                </PageMeta>
            );
        } else {
            return (
                <PageMeta
                    title={"Loading..."}
                    canonical={`/tokens/${this.props.match.params.id}`}
                >
                    <h1>Loading</h1>
                </PageMeta>
            );
        }
    }
})));