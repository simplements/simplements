export class BlockConfigComponent extends HTMLElement {

    private _shadowRoot: ShadowRoot;
    private get template(): HTMLTemplateElement {
        const template = document.createElement('template');
        template.innerHTML = `<div class="block-config-editor" contenteditable="true"> Im block config </div>`
        return template;
    }

    public get value(): string | null | undefined {
        return this._shadowRoot.querySelector('.block-config-editor')?.textContent;
    }

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(this.template.content.cloneNode(true));
    }




}