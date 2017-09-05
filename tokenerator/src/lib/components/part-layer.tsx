import * as React from 'react';
import * as Model from '../../../model';

export function PartLayer(props: PartLayer.Properties) {
    const variant = props.part.variants[props.variant];
    return (
        <use
            xlinkHref={'#' + props.layer.id}
            fill={props.fill || props.layer.defaultStyles.fill || '#FFF'}
            transform={variant.transform}
        />
    );
}

export namespace PartLayer {
    export interface Properties {
        part: Model.Part;
        layer: Model.Part.Layer;
        fill: string;
        variant: string;
    }
}