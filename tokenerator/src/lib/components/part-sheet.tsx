import * as React from 'react';
import * as Model from '../../../model';

/**
 * Constructs the svg part sheet, setting it up to be referenced by tokens
 * @param props React properties
 */
export function PartSheet(props: PartSheet.Properties) {
    return (
        <svg
            viewBox="0 0 90 90"
            id={props.id}
            style={{
                position: 'absolute',
                width: 0,
                height: 0,
                margin: 0
            }}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <PartSheet.Defs {...props}/>
        </svg>
    );
}

export namespace PartSheet {

    /**
     * Properties for a part sheet
     */
    export interface Properties {
        /**
         * Identifier for the part sheet
         */
        id: string;

        /**
         * List of all parts
         */
        parts: Model.Part[];

        /**
         * Optionally, a specific token for this part sheet - if passed, it wil limit the parts to those found in the token
         */
        token?: Model.Token;
    }

    /**
     * Serializes a part fully - this means assembling all the defs + layers into a single payload
     * @param part for serialization
     */
    export function serializePart(part: Model.Part) {
        return [
            part.svg.defs,
            ...Object.keys(part.svg.layers)
                .map(key => part.svg.layers[key].markup)
        ].join('');
    }

    export function shouldUsePart(this: { [id: string]: boolean }, part: Model.Part) {
        if (!!this) {
            return this[part.id] || false;
        } else {
            return true;
        }
    }

    export function Defs(props: PartSheet.Properties) {
        let lookup = null;
        if (!!props.token) {
            lookup = {};
            for (const part of props.token.parts) {
                lookup[part.id] = true;
            }
        }

        const markup = props.parts
            .filter(PartSheet.shouldUsePart.bind(lookup))
            .map(PartSheet.serializePart)
            .join('');

        return (
            <defs
                dangerouslySetInnerHTML={{ __html: markup }}
            />
        );
    }
}