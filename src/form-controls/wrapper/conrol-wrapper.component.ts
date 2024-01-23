export class ControlWrapperComponent extends HTMLElement {
    static selector = 'control-wrapper'


    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
         
        `
    }
}