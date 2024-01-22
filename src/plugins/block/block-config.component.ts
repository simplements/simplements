export class BlockConfigComponent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            
        `
    }

    value(): Record<string, unknown> {
        return {};
    }
}