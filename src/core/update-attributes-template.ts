
import {DefaultTreeAdapterMap} from "parse5";
import {computed, effect, WriteSignal} from "@maverick-js/signals";


export type RenderCallback = (root: ShadowRoot, context:Record<string, unknown>)=> void;
export interface TemplateRenderCallbacks {
    listeners: RenderCallback[],
    computed: RenderCallback[]
}

export function recursiveAttributeUpdate(tree: DefaultTreeAdapterMap["element"], identifier="@", template= (host:string, attr:string)=>`smpl-${host}-${attr.replace('@','')}`) {
    tree?.attrs?.forEach((attr)=> {
        if(attr?.name?.includes(identifier)) {
            attr.name = template(tree.tagName, attr.name)
        }
    });
    tree?.childNodes?.forEach((node)=> recursiveAttributeUpdate(node as DefaultTreeAdapterMap["element"]))
}

export function createTemplate(tree: DefaultTreeAdapterMap['element'], parent: HTMLElement | null): [HTMLElement, TemplateRenderCallbacks] {
    let template = document.createElement('htmlelement');
    let callbacks: TemplateRenderCallbacks = {
        listeners: [],
        computed: []
    }
    if(parent){
        template = parent;
    }
    if(tree.nodeName!== '#text'){
        const element = document.createElement(tree.tagName);
        // @ts-ignore
        const nodeId = (tree.nodeId || 'null');
        element.setAttribute(`smpl--node`, nodeId);
        if(tree.childNodes) {
            tree.childNodes.forEach((node)=>{
                const [_, cb] = createTemplate(node as DefaultTreeAdapterMap['element'], element);
                callbacks.listeners.push(...cb.listeners);
                callbacks.computed.push(...cb.computed);
            })
        }

        if(tree.attrs){
            tree.attrs.forEach((attr)=>{
                if(/(\{\{)\s?([A-Za-z]+)\s?(\}\})/ig.test(attr.value)){
                    callbacks.computed.push((shadowRoot, context)=>{
                        const _el = shadowRoot.querySelector(`[smpl--node="${nodeId}"]`);
                        const value1 = computed(function () {
                            const s = context[attr.value.replace(/\{|\}|\s/ig, '')] as WriteSignal<string>;
                            return s();
                        })

                        effect(() => {
                            const val: string = value1();
                            try{
                                _el?.setAttribute(attr.name, val);
                            }catch (e){
                                console.error(e);
                            }
                        });
                    })
                }
                if(/\(|\)/ig.test(attr.name)){
                    callbacks.listeners.push((shadowRoot, context)=>{
                        const el = shadowRoot.querySelector(`[smpl--node="${nodeId}"]`);
                        const eventName = attr.name.replace(/\(|\)/ig, '');
                        el?.addEventListener(eventName, (event1)=>{
                            const val = attr.value.replace(/\(|\)/ig, '');
                            if(context[val] && typeof context[val]=== 'function'){
                                const fn = context[val] as (event: Event)=> unknown;
                                try {
                                    fn.call(context, event1);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        })
                    })
                    return;
                }
                element.setAttribute(attr.name, attr.value);
            })
        }
        template.appendChild(element);
    }else {
        const textNode = document.createTextNode('');
        const value = (tree as unknown as DefaultTreeAdapterMap['textNode']).value
        // text computed;
        textNode.appendData(value);
        const nodeId = parent?.getAttribute('smpl--node');
        if(/(\{\{)\s?([A-Za-z]+)\s?(\}\})/ig.test(value)){
            const query = document.createComment(value);
            console.log(query);
            template.appendChild(query);
            console.log('value:', value, /(\{\{)\s?([A-Za-z]+)\s?(\}\})/ig.test(value));
            callbacks.computed.push((shadowRoot, context)=>{
                const _el = shadowRoot.querySelector(`[smpl--node="${nodeId}"]`);


                const value1 = computed(function () {
                    const s = context[value.replace(/\{|\}|\s/ig, '')] as WriteSignal<string>;
                    return s();
                })

                effect(() => {
                    const val: string = value1();
                    let nextNodeToReplace = false
                    for(let node of (_el?.childNodes || [])) {
                        if(node.nodeType === Node.COMMENT_NODE) {
                            if(node.nodeValue === value){
                                nextNodeToReplace = true;
                                continue;
                            }
                        }
                        if(nextNodeToReplace){
                            try{
                                console.log(node);
                                (node as Text).textContent = val || '';
                            }catch (e){
                                console.error(e);
                            }
                            break;
                        }
                    }
                });
            })
        }
        template.appendChild(textNode);

    }
    return [template, callbacks];
}