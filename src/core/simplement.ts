
import {createTemplate, recursiveAttributeUpdate, TemplateRenderCallbacks} from "./update-attributes-template";
import {isWriteSignal, MaybeSignal, WriteSignal} from "@maverick-js/signals";
export interface SimplementConfig {
    selector: string,
    template: Promise<{default:string}>,
    styles: Promise<{default:string}>,
}

export abstract class Simplement extends HTMLElement implements CustomElement {
    config!: SimplementConfig;
    static instanceName: string;
    static attributesMap = new Map();
    _shadowDom!: ShadowRoot;
    static get observedAttributes() {
        for(let attr of this.attributesMap.keys()){
            if(attr.includes(`smpl-${this.instanceName}`.toLowerCase())){
                const val = this.attributesMap.get(attr);
                if(val){

                    this.attributesMap.delete(attr);
                    this.attributesMap.set(`smpl-${this.selector}-${val}`.toLowerCase(), val);
                }
            }
        }

        return (
            this.attributesMap && [...this.attributesMap.keys()]
        );
    }
    get attributesMap(): Map<string, string> {
        return Simplement.attributesMap;
    }

    attributeChangedCallback(
        name: string,
        _old: string | null,
        value: string | null
    ) {
        const attributeName = this.attributesMap.get(name);
        if(attributeName && this.hasOwnProperty(attributeName)){
            const update = {[attributeName]: value};
            if(this[attributeName]){
                try{
                    if(isWriteSignal(this[attributeName] as MaybeSignal<unknown>)){
                        (this[attributeName] as WriteSignal<unknown>).set(value);
                    }
                } catch (e) {
                    Object.assign(this, update);
                }
            }
        }
        this.render();
    }
    static selector: string;
    constructor() {
        super();

    }

    [key: string]: unknown;

    connectedCallback(){
        this.constructTemplate().then(([e, callbacks])=>{

            const template = e.content.cloneNode(true);
            this._shadowDom.appendChild(template);
            const elems = this._shadowDom.querySelectorAll('[x-change]')
            for(let elem of elems){
                const attr = elem.getAttribute('x-change')?.replace(/\(|\)/gi, '');

                // @ts-ignore
                elem.addEventListener('x-change', (event: CustomEvent<XEvent>)=>{
                    const cb = attr? this[attr]: undefined;
                    if(cb && typeof cb === 'function'){
                        cb(event);
                    }
                })
            }
            if(callbacks.computed.length){
                callbacks.computed.forEach((apply)=>{
                    apply(this._shadowDom, this);
                })
            }
            if(callbacks.listeners.length){
                callbacks.listeners.forEach((apply)=>{
                    apply(this._shadowDom, this);
                })
            }
            this.init();
            this.render();
        });
    }

    async constructTemplate(): Promise<[HTMLTemplateElement, TemplateRenderCallbacks]> {
        const [styles, templateJson] = await Promise.all([
            this.config.styles.then((e) => e.default),
            this.config.template.then((e_1) => {
                try {
                    return JSON.parse(e_1.default);
                } catch (e_2) {
                    return null;
                }
            }),
        ]);
        const tmpNode = document.createElement('template');
        if (!templateJson) {
            tmpNode.innerHTML = '';
            return [tmpNode, {listeners: [], computed: []}];
        }
        if (Array.isArray(templateJson)) {
            templateJson.forEach((node) => recursiveAttributeUpdate(node));
        }
        recursiveAttributeUpdate(templateJson);
        if (styles) {
            const stl = new CSSStyleSheet();
            stl.replaceSync(styles);
            this._shadowDom.adoptedStyleSheets = [stl];
        }
        if (Array.isArray(templateJson)) {
            const callbacks = templateJson
                .map((node_1) => createTemplate(node_1, null))
                .reduce((acc: TemplateRenderCallbacks, [el, {computed, listeners}]) => {
                        tmpNode.innerHTML += el.innerHTML;
                        acc.computed = [...acc.computed, ...(computed)];
                        acc.listeners = [...acc.listeners, ...(listeners)];
                        return acc;
                    },
                    {listeners: [], computed: []});
            return [tmpNode, callbacks];
        }
        const [tmpl, callbacks_1] = createTemplate(templateJson, null);
        tmpNode.innerHTML += tmpl.innerHTML;
        return [tmpNode, callbacks_1];
    }

    render(){};
    init(){}
}

interface Constructor<T = Simplement> {
    new (...args: any[]): T;
}



export function cmp(config: SimplementConfig) {
    return <T extends Constructor>(Base: T ) => {
        return class cmp extends Base {
            static selector= config.selector;
            static instanceName = Base.name;
            constructor(...args:any[]) {
                super(...args);
                this.config = config;
                this._shadowDom = this.attachShadow({ mode: "open" });
            }
        };
    }
}

export function attr(target: Simplement, propertyKey: string){
    Simplement.attributesMap.set(`smpl-${target.constructor.name}-${propertyKey}`.toLowerCase(),propertyKey);
}