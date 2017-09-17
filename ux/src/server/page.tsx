import * as http from "http";
import * as PropTypes from "prop-types";
import * as React from "react";

import { Model } from "@dougrich/tokenerator";
import { Configuration, constants, Resources, State, StaticContext, Store } from "../universal";
import { origin } from "./config";

export interface PageProperties {
  staticFiles: string[];
  parts: { [id: string]: Model.Part };
  dynamicContent: string;
  resources: Resources;
  state: State;
  context: StaticContext;
  config: Configuration;
}

export default class Page extends React.Component<PageProperties, void> {

  renderCss() {
    return [
      this.props.config.staticFileNames["./dist/packed/theme.css"],
    ]
      .map((s) => <link rel="stylesheet" type="text/css" href={s} key={s}/>);
  }

  renderSvg() {
    const svgStyle: React.CSSProperties = {
      height: 0,
      left: 0,
      overflow: "hidden",
      pointerEvents: "none",
      position: "absolute",
      top: 0,
      width: 0,
    };

    return this.props.staticFiles
      .filter((s) => s.endsWith("svg"))
      .map((s) => <object type="image/svg+xml" data={s} style={svgStyle}/>);
  }

  renderJs() {
    return this.props.staticFiles
      .filter((s) => s.endsWith("js"))
      .map((s) => <script type="text/ecmascript" src={s} key={s}/>);
  }

  embed(key: string, payload: any) {
    return (
      <script
        type="application/json"
        id={key}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
      />
    );
  }

  render() {
    const { description, og, canonical, title } = this.props.context;
    return (
      <html>
        <head>
          <title>{title || this.props.resources.tokenerator}</title>
          {!!description && (<meta property="description" content={description}/>)}
          {!!og && !!og.title && (<meta property="og:title" content={og.title}/>)}
          {!!og && !!og.url && (<meta property="og:url" content={origin + og.url}/>)}
          {!!og && !!og.description && (<meta property="og:description" content={og.description}/>)}
          {!!og && !!og.image && (<meta property="og:image" content={origin + this.props.context.og.image}/>)}
          {!!canonical && (<link rel="canonical" href={origin + canonical}/>)}
          {this.renderCss()}
          <link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto+Slab:700" rel="stylesheet"/>
          {this.embed(constants.resourcesId, this.props.resources)}
          {this.embed(constants.configId, this.props.config)}
          {this.embed(constants.stateId, this.props.state)}
          {this.embed(constants.partId, this.props.parts)}
        </head>
        <body>
          {this.renderSvg()}
          <div id={constants.mountId} dangerouslySetInnerHTML={{ __html: this.props.dynamicContent }}/>
          {this.renderJs()}
        </body>
      </html>
    );
  }
}
