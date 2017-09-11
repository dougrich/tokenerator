import * as React from "react";
import { Link, match } from "react-router-dom";

import { Component, Model } from "@dougrich/tokenerator";
import * as css from "../../theme/core.scss";
import { Page } from "../components";
import { Context, contextTypes } from "../context";
import { dataLoad } from "../data";
import { route } from "../route";
import { DataBound, subscribes } from "../state";
import { slugify } from "../util";
import { cs } from "../util";

export interface TokenDetailsProperties {
    match: match<{
        id: string;
    }>;
    details: DataBound<Model.Token>;
}

export default
route({
    path: "/token/:id/:name?",
},
dataLoad(
async (store, props) => {
    store.dispatch({
        id: props.match.params.id,
        type: "load.details",
    });
},
subscribes({
    details: "details",
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
                            sheet={this.context.config.staticFileNames["./static/parts.svg"]}
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
