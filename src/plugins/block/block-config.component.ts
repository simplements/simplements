import template  from './block-config.component.html';
import styles from './block-config.component.css';
interface IBlockConfig {
    name: string;
    description: string;
    attributes:
        {
            name: string,
            key: string,
            type: string,
            defaultValue: boolean,
            multiple: boolean,
            required: boolean
        }[]

}

export class BlockConfigComponent extends HTMLElement {
    static observedAttributes = ["privatevalue"];
    privatevalue: IBlockConfig | unknown;

    constructor() {
        super();
        console.log(this.privatevalue);
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                ${styles};
            </style>
            ${template}
        `
    }

    attributeChangedCallback(name:unknown, oldValue:unknown, newValue:unknown){
        console.log('hellow', name, oldValue, newValue)
        console.log(this.privatevalue);
    }

    value(): Record<string, unknown> {
        return {};
    }

}