import {cmp, Simplement} from "../../core/simplement";
import {signal} from "@maverick-js/signals";


@cmp({
    selector: 'attribute-config',
    template: import('html:./attribute-config.component.html'),
    styles: import('css:./attribute-config.component.css'),
})
export class AttributeConfigComponent extends Simplement {
    validation= signal([()=>console.log('fuck')]);
    value(): Record<string, unknown> {
        const form = this._shadowDom.querySelector('form');
        console.log(form);
        return {};
    }
    checkData(){
        const form = this._shadowDom.querySelector('form');
        if(form){
            const data =new FormData(form).entries();
            console.log([...data]);
            for (let control of data){
                console.log(control);
            }

        }

    }
}