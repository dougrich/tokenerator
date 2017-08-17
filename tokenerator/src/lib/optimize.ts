import * as style from './optimize.style';
import { Part } from '../../model';

interface OptimizationSession {
    $: CheerioStatic;
    id: string;
    additionalDefs: string[],
    layers: {
        markup: string;
        transform: string;
        legacyLayerId: string;
        id: string;
    }[];
    variants: Part.VariantCollection;
}

interface ElementSession extends CheerioElement {
    style: style.StyleSet;
}

function isIgnored(element: ElementSession) {
    return element.attribs['class'] === 'ignored';
}

function includeDef(this: void, session: OptimizationSession, id: string, selector: string) {
    const elements = session.$('*', selector);
    const roots = session.$(selector);
    transforms.forEach(ts => {
        elements.each(doTransform.bind(session, ts));
        roots.each(doTransform.bind(session, ts));
    });
    roots.attr('id', id);
    session.additionalDefs.push(finalTransform(session.$.html('#' + id)));
}

const transforms = [
    [
        function parseStyle(this: OptimizationSession, index: number, element: ElementSession) {
            if (element.attribs['style']) {
                element.style = style.parse(element.attribs['style']);
            }
        },

        function handleAdditionalImports(this: OptimizationSession, index: number, element: ElementSession) {
            let match;
            const defId = this.id + '-' + this.additionalDefs.length.toString(36);
            if (element.attribs['mask']) {
                const mask = element.attribs['mask'];
                const selector = mask.slice('url'.length + 1, -1);
                const id = 'm-' + defId;
                includeDef(this, id, selector);
                element.attribs['mask'] = `url(#${id})`;
            } else if (element.attribs['xlink:href']) {
                const id = 'l-' + defId;
                includeDef(this, id, element.attribs['xlink:href']);
                element.attribs['xlink:href'] = '#' + id;
            } else if (element.style && (match = /fill\:url\((.+?)\)/gi.exec(element.style.fill)) !== null) {
                let [original, ref] = match;
                const id = 'f-' + defId;
                includeDef(this, id, ref);
                element.style.fill = `url(#${id})`;
            }
        },

        function optimizeStyle(this: OptimizationSession, index: number, element: ElementSession) {
            let style = element.style;

            if (style != null) {
                delete style['stroke-opacity'];
                delete style['fill-opacity'];
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
                    if (style.fill && style.fill.startsWith('#')) {
                        style.fill = 'inherit';
                    }
                }
            }
        },

        function removeAttributes(this: OptimizationSession, index: number, element: ElementSession) {
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

        function removeCircleData(this: OptimizationSession, index: number, element: ElementSession) {
            if (element.tagName === 'circle') {
                delete element.attribs['d'];
            }
        },

        function removeEmptyPaths(this: OptimizationSession, index: number, element: ElementSession) {
            if (element.tagName === 'path' && !element.attribs['d']) {
                const i = element.parent.children.indexOf(element);
                element.parent.children.splice(i, 1);
            }
        }
    ]
];


function doTransform(this: OptimizationSession, ts: Array<Function>, index: number, element: ElementSession) {
    const args = [index, element];
    ts.forEach(t => t.apply(this, args));
}

function finalTransform(markup: string) {
    return markup.trim()
        .replace(/\>\s+\</gi, '><');
}

function parseLayer(this: OptimizationSession, index: number, element: CheerioElement) {

    const legacyLayerId = element.attribs['class'];
    const id = element.attribs['id'];
    const transform = element.attribs['transform'];
    const zIndex = element.attribs['data-z'];

    const elements = this.$('*', element);
    transforms.forEach(ts => elements.each(doTransform.bind(this, ts)));

    this.layers.push({
        markup: finalTransform(this.$(element).html()),
        transform,
        legacyLayerId,
        id
    });
}

function parseVariant(this: OptimizationSession, errors: string[], index: number, element: CheerioElement) {
    
        const key = element.attribs['key'];
        const transform = element.attribs['transform'];
        const collisionSlots = coerceNumber(errors, element.attribs['collision'], `${key} variant collision [collision]`);

        if (this.variants[key]) {
            errors.push(`${key} collision - more than one variant has this key. key must be unique.`);
        } else {
            this.variants[key] = {
                transform,
                collisionSlots
            };
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
        variants: {}
    };
    
    const errors: string[] = [];

    session.$('svg>g').each(parseLayer.bind(session));
    session.$('tokenerator\\:variant').each(parseVariant.bind(session, errors));
    if (Object.keys(session.variants).length === 0) {
        errors.push(`missing variants`);
    }
    
    const legacyId = session.$('svg').attr('class');
    const legacyLayerMapping = {};

    const id = session.id = coerceString(errors, session.$('svg').attr('id'), "part id [id]");
    const name = coerceString(errors, n(() => session.$('tokenerator\\:name').text()), "part name <tokenerator:name>");
    const tags = coerceString(errors, n(() => session.$('tokenerator\\:tags').text()), "part tags <tokenerator:tags>").split(" ");
    const description = coerceString(errors, n(() => session.$('tokenerator\\:description').text()), "part description <tokenerator:description>");
    const author = coerceString(errors, n(() => session.$('tokenerator\\:author').text()), "part author <tokenerator:author>");
    const zIndex = coerceNumber(errors, n(() => session.$('tokenerator\\:z').text()), "part z index <tokenerator:z>");
    const availableStart = n(() => session.$('tokenerator\\:availability').attr("from"));
    const availableEnd = n(() => session.$('tokenerator\\:availability').attr("to"));

    const conflicts = {};

    let layers = session.layers
        .map((layer, i) => {

            if (conflicts[layer.id]) {
                conflicts[layer.id].push(layer.id);
            } else {
                conflicts[layer.id] = [];
            }


            legacyLayerMapping[layer.legacyLayerId] = legacyLayerMapping[layer.legacyLayerId] || [];
            legacyLayerMapping[layer.legacyLayerId].push(i);
            let attributes = [
                `id="p-${id}-${layer.id}"`
            ];

            if (layer.transform) {
                attributes.push(`transform="${layer.transform}"`);
            }
            return `<g ${attributes.join(' ')}>${layer.markup}</g>`;
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
        availability: [availableStart, availableEnd],
        svg: {
            layers,
            defs: session.additionalDefs
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