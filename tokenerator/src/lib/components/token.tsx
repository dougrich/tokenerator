import * as React from 'react';
import * as Model from '../../../model';
import { PartLayer } from './part-layer';

export class Token extends React.Component<Token.Properties, any> {
    render() {
        const layers: Array<PartLayer.Properties & { key: string }> = 
            Array.prototype.concat.apply([], 
                this.props.token.parts
                    .map(tokenPart => {
                        const part = this.props.parts[tokenPart.id];
                        return part.svg.layers.map(layer => {
                            return {
                                key: tokenPart.id + tokenPart.variant + layer.id,
                                part,
                                layer,
                                fill: tokenPart.fill[layer.id] || layer.defaultStyles.fill,
                                variant: tokenPart.variant
                            } as PartLayer.Properties;
                        })
                    }));
        return (
            <svg
                id={this.props.id}
                className={this.props.className}
                viewBox="0 0 90 90"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                {this.props.children}
                {layers.map(layer => <PartLayer {...layer}/>)}
            </svg>
        );
    }
}

export namespace Token {

    /**
     * Properties for a token
     */
    export interface Properties {
        /**
         * Identifier for the token
         */
        id?: string;

        /**
         * Class for the token
         */
        className?: string;

        /**
         * The token to render
         */
        token: Model.Token;

        /**
         * Lookup to get parts
         */
        parts: { [id: string]: Model.Part };
    }
}