import {attr, cmp, Component} from "../../core/component";
import {EVENTS} from "../../core/events";
import {effect, signal} from "@maverick-js/signals";
import {createTemplate} from "../../core/update-attributes-template";


@cmp({
    selector: 'control-wrapper',
    template: import('html:./control-wrapper.compoent.html'),
    styles: import('css:./control-wrapper.component.css'),
})
export class ControlWrapperComponent extends Component {
    @attr
    label= signal("");
    @attr
    controlName = signal("");
    private control: Element | undefined = undefined;

    private eventControlChange = (e: Event) =>{
        const val = `${(this.control as HTMLInputElement).value}`;
        const newEv = Object.assign(EVENTS.change(), {value:val})
        this.control?.dispatchEvent(newEv);
    }

    override init() {
        effect(()=>{
            const value = this.controlName();
            const control = this.querySelector('[slot="control"]')|| undefined;
            if(control){
                control?.setAttribute('id', value)
                control?.setAttribute('name', value)
            }
        });
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
    }
}