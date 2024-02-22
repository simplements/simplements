import {attr, cmp, Simplement} from "../../core/simplement";
import {EVENTS} from "../../core/events";
import {computed, effect, signal, WriteSignal} from "@maverick-js/signals";
import {FormControl} from "../../core/forms";





@cmp({
    selector: 'control-wrapper',
    template: import('html:./control-wrapper.compoent.html'),
    styles: import('css:./control-wrapper.component.css'),
})
export class ControlWrapperComponent extends FormControl {
    @attr
    label= signal("");
    @attr
    controlName = signal("");
    @attr
    validation = signal([] as any);

    private control: Element | undefined = undefined;

    override valueParser(value: string): unknown {
        return value;
    }

    private eventControlChange = (e: Event) =>{
        const val = `${(this.control as HTMLInputElement).value}`;
        const customEvent = EVENTS.modelChange(val)
        this.value.set(val);
        console.log(val);
        this.dispatchEvent(customEvent);
    }

    override init() {
        super.init();
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