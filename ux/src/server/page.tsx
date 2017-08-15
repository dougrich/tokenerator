import * as React from 'react';
import { constants, Store, Resources, State, StaticContext } from '../universal';
import * as PropTypes from 'prop-types';
import * as http from 'http';
import * as fs from 'fs';
import { origin } from './config';

export interface PageProperties {
    staticFiles: string[];
    dynamicContent: string;
    resources: Resources;
    state: State;
    context: StaticContext;
}

export default class Page extends React.Component<PageProperties, void> {
    render() {
        return <html>
            <head>
                <title>{this.props.context.title || this.props.resources.tokenerator}</title>
                {!!this.props.context.description
                    ? <meta property="description" content={this.props.context.description}/>
                    : null}
                {!!this.props.context.og && !!this.props.context.og.title
                    ? <meta property="og:title" content={this.props.context.og.title}/>
                    : null}
                {!!this.props.context.og && !!this.props.context.og.url
                    ? <meta property="og:url" content={origin + this.props.context.og.url}/>
                    : null}
                {!!this.props.context.og && !!this.props.context.og.description
                    ? <meta property="og:description" content={this.props.context.og.description}/>
                    : null}
                {!!this.props.context.og && !!this.props.context.og.image
                    ? <meta property="og:image" content={origin + this.props.context.og.image}/>
                    : null}
                {!!this.props.context.canonical
                    ? <link rel="canonical" href={origin + this.props.context.canonical}/>
                    : null}
                {this.props.staticFiles
                    .filter(s => s.endsWith('css'))
                    .map(s => <link rel="stylesheet" type="text/css" href={s} key={s}/>)}
                <script type="application/json" id={constants.resourcesId} dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.resources) }}/>
                <script type="application/json" id={constants.stateId} dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.state) }}/>
            </head>
            <body>
                <div id={constants.mountId} dangerouslySetInnerHTML={{ __html: this.props.dynamicContent }}/>
                {this.props.staticFiles
                    .filter(s => s.endsWith('js'))
                    .map(s => <script type="text/ecmascript" src={s} key={s}/>)}
            </body>
        </html>;
    }
}