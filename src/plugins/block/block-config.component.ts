import {attr, cmp, Simplement} from "../../core/simplement";
import {signal} from "@maverick-js/signals";
import {ModelChangeEvent} from "../../core/events";
interface IBlockConfig {
    name: string;
    description: string;
    attributes:
        {
            name: string,
            key: string,
            type: string,
            defaultValue: boolean,
            multiple: boolean,
            required: boolean
        }[]

}

@cmp({
    selector: 'block-config',
    template: import('html:./block-config.component.html'),
    styles: import('css:./block-config.component.css'),
})
export class BlockConfigComponent extends Simplement {
    @attr
    privateValue: IBlockConfig | unknown;

    data =  signal("");

    labelHeader = signal('Создание типа блока');

    value(): Record<string, unknown> {
        return {};
    }

    updateData(event: CustomEvent<ModelChangeEvent>){
        this.data.set(event?.detail?.value);
    }
    change(){
        this.labelHeader.set("updated");
    }
}