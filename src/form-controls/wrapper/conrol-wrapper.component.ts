export class ControlWrapperComponent extends HTMLElement implements CustomElement{
    static selector = 'control-wrapper'
    static observedAttributes = ["label"];
    label: string | null |undefined;


    private _shadowDom;


    constructor() {
        super();
        this._shadowDom = this.attachShadow({mode:'open'});
        this.render();
    }
    render(){
        this._shadowDom.innerHTML = '';
        this._shadowDom.onslotchange =(...args)=>{ console.log(args)}
        this._shadowDom.appendChild(this.templateT().content.cloneNode(true));
    }

    templateT(): HTMLTemplateElement {
        const template = document.createElement('template');
        template.innerHTML = `

            <style>
                .form-control {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    min-height: 66px;
                    align-content: center;
                    align-items: center;
                    justify-content: flex-start;
                    flex-wrap: nowrap;
                    overflow: hidden;
                }
                
.form-control ::slotted(input),
.form-control ::slotted(textarea),
.form-control ::slotted( select) {
    display: flex;
    flex-grow: 1;
}

.form-control label{
    display: inline-block;
    white-space: nowrap;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    line-height: 20px;
    color: var(--base-06);
    transition: 0.2s ease-in;
}



.form-control ::slotted(input[type=text]) + label,
.form-control ::slotted(textarea ~ label) ,
.form-control ::slotted(select) ~ label{
    position: absolute;
    left: 12px;
    top: 22px;
    font-weight: 500;
}

.form-control ::slotted(textarea),
.form-control ::slotted(input[type=text]),
.form-control ::slotted(select)
{
    box-sizing: content-box;
    font-family: sans-serif;
    height: 36px;
    border: 1px solid var(--base-03);
    font-size: 16px;
    padding: 20px 12px 8px;
    background: var(--base-03);
    border-radius: 8px;
}
.form-control ::slotted(input[type=text]:focus),
.form-control ::slotted(select:focus),
.form-control ::slotted(textarea:focus) {
    color: var(--primary);
}

.form-control ::slotted(input[type=text]:focus) ~ label,
.form-control ::slotted(input[type=text]:not(:placeholder-shown)) ~ label,
.form-control ::slotted(select:focus) ~ label,
.form-control ::slotted(select:not(:placeholder-shown)) ~ label,
.form-control ::slotted(textarea:focus) ~ label,
.form-control ::slotted(textarea:not(:placeholder-shown)) ~ label{
    top:4px;
    font-size: 12px;
    color: var(--primary);
}

.form-control input[type=text][value]:invalid,
.form-control input[type=text][value=""]:invalid,
.form-control input[type=text][value]:invalid ~ label
{
    color: red;
}

.form-control textarea {
    height: unset;
}

            </style>
            <div class="form-control">
                <slot name="control"></slot>
                <label>${this.label}</label>
            </div>
        `;
        return template;
    }

    attributeChangedCallback(
        name: string,
        _old: string | null,
        value: string | null
    ) {
        if(name === 'label'){
            this.label = value;
        }
        this.render();

    }
}