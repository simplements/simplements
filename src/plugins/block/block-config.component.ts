
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

export class BlockConfigComponent extends HTMLElement {
    static observedAttributes = ["privatevalue"];
    privatevalue: IBlockConfig | unknown;

    constructor() {
        super();
        console.log(this.privatevalue);
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                .block-config{
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    background: var(--base-02);
                    border: 1px solid var(--base-03);
                    border-radius: 8px;
                    padding: 8px;
                    align-content: space-between;
                    gap: 16px;
                }
            </style>
            <form class="block-config">
                    <h3>Создание типа блока</h3>
                    <control-wrapper label="Название типа блока">
                        <input slot="control" type="text" name="blockTypeName" id="blockTypeName" required placeholder=" "/>
                    </control-wrapper>
                    <div class="form-control">
                        <textarea name="blockDescription" id="blockDescription" required placeholder=" "></textarea>
                        <label for="blockDescription">Описание блока</label>
                    </div>
                    <h4>Аттрибуты блока</h4>
                    <attribute-config></attribute-config>
            </form>
        `
    }

    attributeChangedCallback(name:unknown, oldValue:unknown, newValue:unknown){
        console.log('hellow', name, oldValue, newValue)
        console.log(this.privatevalue);
    }

    value(): Record<string, unknown> {
        return {};
    }

}