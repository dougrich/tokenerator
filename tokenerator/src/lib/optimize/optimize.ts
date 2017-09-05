import * as style from './style';
import * as collision from './collision';
import * as availability from './availability';
import { Part } from '../../../model';

interface OptimizationSession {
    $: CheerioStatic;
    id: string;
    additionalDefs: string[],
    layers: {
        markup: string;
        transform: string;
        legacyLayerId: string;
        id: string;
        defaults: Part.LayerDefaultStyles;
    }[];
    variants: Part.VariantCollection;
    availability: [number, number];
}

interface LayerSession {
    defaults: Part.LayerDefaultStyles;
}

interface ElementSession extends CheerioElement {
    style: style.StyleSet;
}

function isIgnored(element: ElementSession) {
    return element.attribs['class'] === 'ignored';
}

function includeDef(this: void, session: OptimizationSession, id: string, selector: string, layerSession: LayerSession) {
    const elements = session.$('*', selector);
    const roots = session.$(selector);
    transforms.forEach(ts => {
        elements.each(doTransform.bind(session, ts, layerSession));
        roots.each(doTransform.bind(session, ts, layerSession));
    });
    roots.attr('id', id);
    session.additionalDefs.push(finalTransform(session.$.html('#' + id)));
}

const transforms = [
    [
        function parseStyle(this: OptimizationSession, layerSession: LayerSession, index: number, element: ElementSession) {
            if (element.attribs['style']) {
                element.style = style.parse(element.attribs['style']);
            }
        },

        function handleAdditionalImports(this: OptimizationSession, layerSession: LayerSession, index: number, element: ElementSession) {
            let match;
            const defId = [this.id, this.additionalDefs.length.toString(36)].join('-');
            if (element.attribs['mask']) {
                const mask = element.attribs['mask'];
                const selector = mask.slice('url'.length + 1, -1);
                const id = 'm-' + defId;
                includeDef(this, id, selector, layerSession);
                element.attribs['mask'] = `url(#${id})`;
            } else if (element.attribs['xlink:href']) {
                const id = 'l-' + defId;
                includeDef(this, id, element.attribs['xlink:href'], layerSession);
                element.attribs['xlink:href'] = '#' + id;
            } else if (element.style && (match = /url\((.+?)\)/gi.exec(element.style.fill)) !== null) {
                let [original, ref] = match;
                const id = 'f-' + defId;
                includeDef(this, id, ref, layerSession);
                element.style.fill = `url(#${id})`;
            }
        },

        function optimizeStyle(this: OptimizationSession, layerSession: LayerSession, index: number, element: ElementSession) {
            let style = element.style;

            if (style != null) {
                if (style['stroke-opacity'] && style['stroke-opacity'].startsWith('1')) {
                    delete style['stroke-opacity'];
                }
            
                if (style['fill-opacity'] && style['fill-opacity'].startsWith('1')) {
                    delete style['fill-opacity'];
                }
                delete style['display'];
                delete style['visibility'];
                delete style['fill-rule'];
                delete style['marker'];
                delete style['marker-start'];
                delete style['marker-mid'];
                delete style['marker-end'];
                delete style['overflow'];
                delete style['enable-background'];
                delete style['stroke-dasharray'];
                delete style['stroke-dashoffset'];
                
                if (!isIgnored(element)) {
                    if (style.fill && /^\#[0-9a-fA-F]+$/gi.test(style.fill)) {
                        if (!layerSession.defaults.fill) {
                            layerSession.defaults.fill = style.fill;
                        }
                        style.fill = 'inherit';
                    }
                }
            }

            element.style = style;
        },

        function removeAttributes(this: OptimizationSession, layerSession: LayerSession, index: number, element: ElementSession) {
            const attributes = Object.keys(element.attribs);
            delete element.attribs['id'];
            delete element.attribs['class'];
            if (element.tagName === 'linearGradient') {
                delete element.attribs['href'];
            }
            attributes.forEach(attribute => {
                if (attribute.startsWith('sodipodi') || attribute.startsWith('inkscape')) {
                    delete element.attribs[attribute];
                }
            });
        },

        function removeCircleData(this: OptimizationSession, layerSession: LayerSession, index: number, element: ElementSession) {
            if (element.tagName === 'circle') {
                delete element.attribs['d'];
            }
        },

        function removeEmptyPaths(this: OptimizationSession, layerSession: LayerSession, index: number, element: ElementSession) {
            if (element.tagName === 'path' && !element.attribs['d']) {
                const i = element.parent.children.indexOf(element);
                element.parent.children.splice(i, 1);
            }
        },

        function serializeStyle(this: OptimizationSession, layerSession: LayerSession, index: number, element: ElementSession) {
            if (element.style != null) {
                element.attribs['style'] = style.serialize(element.style);
            }
        }
    ]
];


function doTransform(this: OptimizationSession, ts: Array<Function>, layerSession: LayerSession, index: number, element: ElementSession) {
    const args = [layerSession, index, element];
    ts.forEach(t => t.apply(this, args));
}

function finalTransform(markup: string) {
    return markup.trim()
        .replace(/\>\s+\</gi, '><');
}

function parseLayer(this: OptimizationSession, index: number, element: CheerioElement) {

    const legacyLayerId = element.attribs['class'];
    const id = element.attribs['id'];
    if (id && id.startsWith('--')) {
        return;
    }
    const transform = element.attribs['transform'];
    const zIndex = element.attribs['data-z'];
    const layerSession: LayerSession = {
        defaults: {}
    };
    const elements = this.$('*', element);
    transforms.forEach(ts => elements.each(doTransform.bind(this, ts, layerSession)));

    const defaults: Part.LayerDefaultStyles = {};
    

    this.layers.push({
        markup: finalTransform(this.$(element).html()),
        transform,
        legacyLayerId,
        id,
        ...layerSession
    });
}

function parseVariant(this: OptimizationSession, errors: string[], index: number, element: CheerioElement) {

    if (element.attribs['collision']) {
        this.variants['$'] = {
            transform: "",
            collisionSlots: collision.getCollision(errors, '$', element.attribs['collision'])
        }
    } else {
        this.$('tokenerator\\:variant').each((i, element) => {
            const key = element.attribs['key'];
            const transform = element.attribs['transform'];
            const collisionSlots = collision.getCollision(errors, key, element.attribs['collision']);
        
            if (this.variants[key]) {
                errors.push(`${key} collision - more than one variant has this key. key must be unique.`);
            } else {
                this.variants[key] = {
                    transform,
                    collisionSlots
                };
            }
        });
    }
}

function parseAvailability(this: OptimizationSession, errors: string[], index: number, element: CheerioElement) {
    if (element.attribs['type']) {
        if (availability.shortcuts[element.attribs['type']]) {
            this.availability = availability.shortcuts[element.attribs['type']];
        } else {
            errors.push(`invalid availability type: got ${element.attribs['type']}, need one of ${Object.keys(availability.shortcuts)}`)
            this.availability = [null, null];
        }
    } else {
        this.availability = [
            availability.parseAvailability(errors, 'from', element.attribs['from']),
            availability.parseAvailability(errors, 'to', element.attribs['to']),
        ];
    }
}

function coerceNumber(errors: string[], input: string, name: string, id: string = ''): number {
    if (!input) {
        errors.push(`${id} is missing a ${name}`);
        return 0;
    } else if (!/^[0-9]+$/gi.test(input)){
        errors.push(`${id} has a non-number ${name}: ${input}`);
        return 0;
    } else {
        return parseInt(input);
    }
}

function coerceString(errors: string[], input: string, name: string, id: string = ''): string {
    if (!input) {
        errors.push(`${id} is missing a ${name}`);
        return "";
    } else {
        return input;
    }
}

function n(call: () => string): string {
    try {
        return call();
    } catch (err) {
        return null;
    }
}

export interface OptimizationResult {
    legacyId: string;
    legacyLayerMapping: { [id: string]: number };
    part: Part;
    errors: string[];
}

export function optimize(cheerio: CheerioAPI, svg: string): OptimizationResult {
    const session: OptimizationSession = {
        $: cheerio.load(svg, {
            xmlMode: true
        }),
        additionalDefs: [],
        layers: [],
        id: "",
        variants: {},
        availability: null
    };
    
    const errors: string[] = [];
    
    const id = session.id = coerceString(errors, session.$('svg').attr('id'), "part id [id]");

    session.$('svg>g').each(parseLayer.bind(session));
    session.$('tokenerator\\:variants').each(parseVariant.bind(session, errors));
    session.$('tokenerator\\:availability').each(parseAvailability.bind(session, errors));
    if (Object.keys(session.variants).length === 0) {
        errors.push(`missing variants`);
    }
    
    if (!session.availability) {
        errors.push(`missing availability <tokenerator:availability>`);
    }
    
    const legacyId = session.$('svg').attr('class');
    const legacyLayerMapping = {};
    const name = coerceString(errors, n(() => session.$('tokenerator\\:name').text()), "part name <tokenerator:name>");
    const tagElements = session.$('tokenerator\\:tags').toArray();
    let tags: string[] = name.split(' ').map(part => part.toLowerCase());
    if (tagElements.length) {
        tags = tags.concat(session.$('tokenerator\\:tags').text().split(" "));
    }
    const descriptionElements = session.$('tokenerator\\:description').toArray();
    const description = descriptionElements ? session.$('tokenerator\\:description').text() : name;
    const author = coerceString(errors, n(() => session.$('tokenerator\\:author').text()), "part author <tokenerator:author>");
    const zIndex = coerceNumber(errors, n(() => session.$('tokenerator\\:z').text()), "part z index <tokenerator:z>");

    const conflicts = {};

    let layers: Part.Layer[] = [];
    session.layers
        .forEach((layer, i) => {

            if (conflicts[layer.id]) {
                conflicts[layer.id].push(layer.id);
            } else {
                conflicts[layer.id] = [];
            }


            legacyLayerMapping[layer.legacyLayerId] = legacyLayerMapping[layer.legacyLayerId] || [];
            legacyLayerMapping[layer.legacyLayerId].push(i);
            const layerId = `p${i}${id}${layer.id}`;
            let attributes = [
                `id="${layerId}"`
            ];

            if (layer.transform) {
                attributes.push(`transform="${layer.transform}"`);
            }

            layers.push({
                id: layerId,
                markup: `<g ${attributes.join(' ')}>${layer.markup}</g>`,
                defaultStyles: layer.defaults
            });
        });

    const part: Part = {
        id,
        zIndex,
        meta: {
            name,
            tags,
            description,
            author
        },
        availability: session.availability || [null, null],
        svg: {
            layers,
            defs: session.additionalDefs.join('')
        },
        variants: session.variants
    };
    
    return {
        part,
        errors,
        legacyId,
        legacyLayerMapping
    };
}