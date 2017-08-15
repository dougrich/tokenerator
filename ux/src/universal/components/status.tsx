import * as React from 'react';
import { Route } from 'react-router';
import * as PropTypes from 'prop-types';
import { StaticContext } from '../staticContext';
import { Resources } from '../resources';

export interface PageMetaProperties {
    statusCode?: number;
    canonical?: string;
    description?: string;
    title?: string;
    preview?: string;
    children?: any;
}

function setMeta(type: string, content: string) {
    let meta = document.querySelector(`meta[property="${type}"]`);
    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", type);
        document.querySelector("head").appendChild(meta);
    }
    meta.setAttribute("content", content);
}

function setCanonical(href: string) {
    let link = document.querySelector(`link[rel=canonical]`);
    if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.querySelector("head").appendChild(link);
    }
    link.setAttribute("href", href);
}

export class PageMeta extends React.PureComponent<PageMetaProperties, void> {
    static contextTypes = {
        resources: PropTypes.object
    };

    context: {
        resources: Resources;
    }

    render() {
        return <Route render={(state: { staticContext?: StaticContext }) => {
            if (IS_CLIENT) {
                // set things directly
                if (this.props.title) {
                    document.title = this.props.title + " | " + this.context.resources.tokenerator;
                    setMeta("og:title", this.props.title);
                }

                if (this.props.canonical) {
                    setMeta("og:url", location.origin + this.props.canonical);
                    setCanonical(location.origin + this.props.canonical);
                }
                
                if (this.props.description) {
                    setMeta("og:description", this.props.description);
                    setMeta("description", this.props.description)
                }

                if (this.props.preview) {
                    setMeta("og:image", location.origin + this.props.preview);
                }

            } else {
                const context = state.staticContext;
                context.statusCode = this.props.statusCode;
                if (this.props.title) {
                    context.title = this.props.title + " | " + this.context.resources.tokenerator;
                    context.og = {
                        ...context.og || {},
                        title: this.props.title
                    };
                }
                if (this.props.canonical) {
                    context.canonical = this.props.canonical;
                    context.og = {
                        ...context.og || {},
                        url: this.props.canonical
                    };
                }
                if (this.props.description) {
                    context.description = this.props.description;
                    context.og = {
                        ...context.og || {},
                        description: this.props.description
                    };
                }
                if (this.props.preview) {
                    context.og = {
                        ...context.og || {},
                        image: this.props.preview
                    };
                }
            }
            return this.props.children;
        }}/>;
    }
}