import {cmp, Component} from "../../core/component";


@cmp({
    selector: 'attribute-config',
    template: import('html:./attribute-config.component.html'),
    styles: import('css:./attribute-config.component.css'),
})
export class AttributeConfigComponent extends Component {
    value(): Record<string, unknown> {
        const form = this._shadowDom.querySelector('form');
        console.log(form);
        return {};
    }
}