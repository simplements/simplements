
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
            if(attr.includes(`@attr-${this.instanceName}`.toLowerCase())){
                const val = this.attributesMap.get(attr);
                if(val){
                    this.attributesMap.delete(attr);
                    this.attributesMap.set(`@attr-${this.selector}-${val}`.toLowerCase(), val);
                }
            }
        }
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
            Object.assign(this, update);
        }
        this.render();
    }
    static selector: string;
    constructor() {
        super();

    }

    [key: string]: unknown;

    connectedCallback(){
        this.constructTemplate().then((e)=>{
            const template = e.content.cloneNode(true);
            this._shadowDom.appendChild(template);
            const elems = this._shadowDom.querySelectorAll('[x-change]')
            for(let elem of elems){
                const attr = elem.getAttribute('x-change')?.replace(/\(|\)/gi, '');

                // @ts-ignore
                elem.addEventListener('x-change', (event: EVENTS.change)=>{

                    const cb = attr? this[attr]: undefined;
                    if(cb && typeof cb === 'function'){
                        cb(event);
                    }
                })
            }
            this.render();
        });
    }

    constructTemplate(): Promise<HTMLTemplateElement> {
        const tmpNode = document.createElement('template');
        return Promise.all([
            this.config.styles.then((e)=> e.default),
            this.config.template.then((e)=>e.default),
        ]).then(([styles, template])=>{

            const reducedTemplate = template.replaceAll(/<(\S+).+(@\S+).+>/ig,(substring, ...args)=> {
                const string1 = substring;
                const scope = args[0];
                console.log('repl', string1, args);
                if(string1 &&  scope){
                    return string1.replaceAll(/@(\S+)=/ig, `@attr-${scope}-$1=`)
                }
                return  string1;
            })
            console.log(reducedTemplate);

            tmpNode.innerHTML = `
                        <style>
                         ${styles}
                         </style>
                       ${reducedTemplate}`
            return tmpNode
        })
    }

    render(){
        console.log('super');
    };
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
    Component.attributesMap.set(`@attr-${target.constructor.name}-${propertyKey}`.toLowerCase(),propertyKey);
}