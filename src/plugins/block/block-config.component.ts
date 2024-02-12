import {attr, cmp, Component} from "../../core/component";
import {effect, signal, tick} from "@maverick-js/signals";
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
export class BlockConfigComponent extends Component {
    @attr
    privateValue: IBlockConfig | unknown;

    labelHeader = signal('Создание типа блока');

    value(): Record<string, unknown> {
        return {};
    }

    updateData(...args: unknown[]){
        console.log(args);
    }
    change(){
        this.labelHeader.set("updated");
    }
}