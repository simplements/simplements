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
        const newEv = Object.assign(EVENTS.modelChange(val), )
        this.dispatchEvent(newEv);
    }

    override init() {
        this.control = this._shadowDom?.querySelector('[slot="control"]')|| this.querySelector('[slot="control"]')|| undefined;
        this.addModelChangeListener();
        effect(()=>{
            const value = this.controlName();
            if(this.control){
                this.control?.setAttribute('id', value)
                this.control?.setAttribute('name', value)
            }
        });
    }
    addModelChangeListener(){
        if(this.control){
            this.control.addEventListener('input', this.eventControlChange);
            this.control.addEventListener('change', this.eventControlChange);
            this.control.addEventListener('blur', this.eventControlChange);
        }
    }
}