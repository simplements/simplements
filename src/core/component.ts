import {serializeOuter} from "parse5";
import {XEvent} from "./events";
import {createTemplate, recursiveAttributeUpdate, TemplateRenderCallbacks} from "./update-attributes-template";
import {tick} from "@maverick-js/signals";
export interface ComponentConfig {
    selector: string,
    template: Promise<{default:string}>,
    styles: Promise<{default:string}>,
}
type AttributeMap = Map<string, PropertyKey>;
export abstract class Component extends HTMLElement implements CustomElement {
    config!: ComponentConfig;
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
        console.log([...this.attributesMap.keys()])
        return (
            this.attributesMap && [...this.attributesMap.keys()]
        );
    }

    get attributesMap(): Map<string, string> {
        return Component.attributesMap;
    }

    attributeChangedCallback(
        name: string,
        _old: string | null,
        value: string | null
    ) {
        const attributeName = this.attributesMap.get(name);
        if(attributeName && this.hasOwnProperty(attributeName)){
            const update = {[attributeName]: value};
            console.log(update);
            if(this[attributeName]){
                try{
                    // @ts-ignore
                    this[attributeName].set(value);

                } catch (e) {
                    Object.assign(this, update);
                }
            }
            // Object.assign(this, update);
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

    constructTemplate(): Promise<[HTMLTemplateElement, TemplateRenderCallbacks]> {
        return Promise.all([
            this.config.styles.then((e)=> e.default),
            this.config.template.then((e)=>{
                try {
                    return JSON.parse(e.default)
                }catch (e){
                    return null;
                }
            }),
        ]).then(([styles, templateJson])=>{

            const tmpNode = document.createElement('template');
            if(!templateJson){
                tmpNode.innerHTML = '';
                return [tmpNode, {listeners:[], computed:[]}];
            }
            console.log(templateJson);
            recursiveAttributeUpdate(templateJson)


            if(styles){
                tmpNode.innerHTML+= `<style>${styles}</style>`;
            }

            const [tmpl, callbacks] = createTemplate(templateJson, null);
            tmpNode.innerHTML+= tmpl.innerHTML;
            return [tmpNode, callbacks];
        })
    }

    render(){
        console.log('super');
    };
    init(){
        console.log('init');
    }
}

interface Constructor<T = Component> {
    new (...args: any[]): T;
}



export function cmp(config: ComponentConfig) {
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

export function attr(target: Component, propertyKey: string){
    Component.attributesMap.set(`smpl-${target.constructor.name}-${propertyKey}`.toLowerCase(),propertyKey);
}