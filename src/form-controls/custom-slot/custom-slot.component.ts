import {attr, cmp, Simplement} from "../../core/simplement";
import {effect, signal} from "@maverick-js/signals";


@cmp({
    selector: 'x-slot',
    template: Promise.resolve({default:``}),
    styles: Promise.resolve({default:``}),
})
export class CustomSlotComponent extends Simplement{
    @attr
    name = signal("");
    elem: HTMLElement | null = null;

    override init() {
        effect(()=>{
            const name = this.name();
            if(name){
                if(name){
                    this.elem = (this.parentNode?.parentNode as ShadowRoot).host.querySelector(`[slot="${name}"]`);
                }
                if(this.elem){
                    this.insertAdjacentElement('afterend', this.elem);
                }
            }
        })
    }
}