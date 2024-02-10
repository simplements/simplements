import {attr, cmp, Component} from "../../core/component";


@cmp({
    selector: 'x-slot',
    template: Promise.resolve({default:``}),
    styles: Promise.resolve({default:``}),
})
export class CustomSlotComponent extends Component{
    @attr
    name: string | null |undefined = null;
    elem: HTMLElement | null = null;
    override render() {
        if(this.name){
            this.elem = (this.parentNode?.parentNode as ShadowRoot).host.querySelector(`[slot="${this.name}"]`);
        }
        if(this.elem){
            this.insertAdjacentElement('afterend', this.elem);
        }
    }
}