import { State } from './state';
import * as Errors from './errors';

export namespace Action {
    export function AddPart(state: State, action: State.Action.Add): State {
        const part = state.parts[action.partId];
        
        if (!part) {
            throw new Errors.MissingPartFromLookup();
        } else if (!part.variants[action.variant]) {
            throw new Errors.MissingVariantFromPart();
        }
        
        const variant = part.variants[action.variant];
        
        const parts = state.token.parts.slice();
        
        const fill = {};
        
        for (let i = 0; i < part.svg.layers.length; i++) {
            fill[part.svg.layers[i].id] = part.svg.layers[i].defaultStyles.fill;
        }
        
        const hasAdded = false;
        
        const newPart = {
            id: action.partId,
            variant: action.variant,
            fill
        };

        for (let i = 0; i < parts.length; i++) {
            const tokenPart = parts[i];
            const tokenVariant = state.parts[tokenPart.id].variants[tokenPart.variant];
            if (state.options.collide && (tokenVariant.collisionSlots & variant.collisionSlots) !== 0) {
                // remove colliding parts
                parts.splice(i--, 1);
                continue;
            }

            if (!hasAdded && state.parts[tokenPart.id].zIndex <= part.zIndex) {
                parts.splice(i++, 0, newPart);
            }
        }

        if (!hasAdded) {
            parts.push(newPart);
        }

        return {
            ...state,
            token: {
                ...state.token,
                parts
            }
        };
    }

    export function RemovePart(state: State, action: State.Action.Remove): State {
        
        const parts = state.token.parts.slice();
        parts.splice(action.index, 1);
        
        return {
            ...state,
            token: {
                ...state.token,
                parts
            }
        };
    }
    
    export function ColorLayer(state: State, action: State.Action.Color): State {
        
        const parts = state.token.parts.slice();

        parts[action.partIndex] = {
            ...parts[action.partIndex],
            fill: {
                ...parts[action.partIndex].fill,
                [action.layerId]: action.color
            }
        };
        
        return {
            ...state,
            token: {
                ...state.token,
                parts
            }
        };
    }

    export function Reduce(state: State, action: State.Action.Any): State {
        switch (action.type) {
            case 'token.part.add': return AddPart(state, action);
            case 'token.part.remove': return RemovePart(state, action);
            case 'token.part.color': return ColorLayer(state, action);
            default: return state;
        }
    }
}