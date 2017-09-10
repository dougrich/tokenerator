import * as React from 'react';
import { Context, contextTypes } from '../../context';
import * as css from '../../../theme/core.scss';
import { cs } from '../../util';


export class HeroBackground extends React.PureComponent<HeroBackground.Properties, void> {
  render() {
    const tokens = this.props.tokens || HeroBackground.DefaultTokens;
    return (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        {...cs(css.oHeaderBackground)}
      >
        <defs>
          <linearGradient id="o-NavHero-gradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#05415A" stopOpacity="0.25"/>
            <stop offset="25%" stopColor="#05415A" stopOpacity="0.75"/>
            <stop offset="50%" stopColor="#05415A" stopOpacity="1"/>
            <stop offset="75%" stopColor="#05415A" stopOpacity="0.75"/>
            <stop offset="100%" stopColor="#05415A" stopOpacity="0.25"/>
          </linearGradient>
          <pattern id="o-NavHero-pattern" x="0" y="0" patternUnits="userSpaceOnUse" width="270" height="270">
            <rect x="0" y="0" width="360" height="360" fill="#fff"/>
            {tokens.map((token, i) => (<HeroBackground.InlineToken key={i} position={i} parts={token}/>))}
          </pattern>
          <mask id="o-NavHero-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" height="100%" width="100%" fill="url(#o-NavHero-pattern)"/>
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#o-NavHero-gradient)" mask="url(#o-NavHero-mask)"/>
      </svg>
    );
  }
}

export namespace HeroBackground {
  export interface Properties {
    tokens?: Array<TrimmedDownToken>;
  }

  export type TrimmedDownToken = Array<string>;

  export const DefaultTokens: Array<TrimmedDownToken> = [
    ['#p0wolf-bodybody'],
    [
      "#p0basic-bodylayer1",
      "#p0winged-armorlayer1",
      "#p0winged-armorlayer2",
      "#p0winged-helmetlayer2",
      "#p1winged-helmetlayer1",
      "#p0pauldronslayer1",
      "#p0greatswordlayer1"
    ],
    [
      "#p0basic-bodylayer1",
      "#p0robeslayer1",
      "#p0scarflayer1",
      "#p0book-leftlayer1",
      "#p0old-man-hairlayer1"
    ],
    [
      "#p0simple-capelayer1",
      "#p0basic-bodylayer1",
      "#p0pocketed-shirtlayer1",
      "#p1pocketed-shirtlayer2",
      "#p1smooth-hoodlayer1",
      "#p0scimitar-leftlayer1"
    ],
    [
      "#p0mummylayer1",
      "#p1mummylayer2",
      "#p0minotaur-hornslayer1",
      "#p0sickle-leftlayer1"
    ],
    [
      "#p0basic-bodylayer1",
      "#p0bound-maillayer1",
      "#p1bound-maillayer2",
      "#p0plumed-helmetlayer1",
      "#p1plumed-helmetlayer2",
      "#p0shortsword-leftlayer1"
    ],
    [
      "#p0elflayer1",
      "#p0scale-maillayer1",
      "#p0pretty-boy-hairlayer1",
      "#p0spiky-pauldronslayer1",
      "#p0small-axe-leftlayer1"
    ],
    [
      "#p0demon-wingslayer1",
      "#p1demon-wingslayer2",
      "#p0frog-legslayer1",
      "#p0elflayer1",
      "#p0minotaur-hornslayer1",
      "#p0cyclops-eyelayer1",
      "#p1cyclops-eyelayer2"
    ],
    [
      "#p0basic-bodylayer1",
      "#p0business-hairlayer1",
      "#p0jacketlayer2",
      "#p1jacketg3795",
      "#p0bandanalayer1",
      "#p0musketlayer2",
      "#p1musketlayer1",
      "#p2musketlayer3"
    ]
  ]
  
  export class InlineToken extends React.PureComponent<InlineToken.Properties, void> {
    static contextTypes = contextTypes;
    context: Context;

    render() {
      const left = this.props.position % 3;
      const top = (this.props.position - left) / 3;
      const transform = `translate(${left*90},${top*90})`;
      return (
        <g transform={transform}>
          {this.props.parts.map(link => (
            <use
              xlinkHref={this.context.config.staticFileNames['./static/parts.svg'] + link}
              key={link}
              fill="#fff"
            />))}
        </g>
      );
    }
  }

  export namespace InlineToken {
    export interface Properties {
      parts: string[];
      position: number;
    }
  }
}