import {attr, cmp, Component} from "../../core/component";
import {EVENTS} from "../../core/events";
import * as events from "events";


@cmp({
    selector: 'control-wrapper',
    template: import('html:./control-wrapper.compoent.html'),
    styles: import('css:./control-wrapper.component.css'),
})
export class ControlWrapperComponent extends Component {
    @attr
    label: string | null |undefined = null;
    @attr
    controlName: string | null = null;
    private control: Element | undefined = undefined;

    private eventControlChange = (e: Event) =>{
        const val = `${(this.control as HTMLInputElement).value}`;
        const newEv = Object.assign(EVENTS.change(), {value:val})
        this.control?.dispatchEvent(newEv);
    }

    override render(){
        if(!this._shadowDom) return;
        if(!this.control){
            this.control = this._shadowDom?.querySelector('[slot="control"]')|| undefined;
            if(this.control){
                this.control.addEventListener('input', this.eventControlChange);
                this.control.addEventListener('change', this.eventControlChange);
                this.control.addEventListener('blur', this.eventControlChange);
            }
        }

        const label = this._shadowDom.querySelector('label') || null;
        if(label && this.label){
            label.innerHTML = this.label;
        }
        if(this.controlName && label){
            this.control?.setAttribute('id', this.controlName)
            this.control?.setAttribute('name', this.controlName)
            label.setAttribute('for', this.controlName);
        }
    }
}