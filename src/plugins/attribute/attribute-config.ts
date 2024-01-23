export class AttributeConfigComponent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            
            <form>
            <div class="attribute-form-row">
                    <div class="form-control">
                        <input type="text" name="attributeName" id="attributeName" required pattern="^[a-zA-Z]+$" placeholder=" "/>
                        <label  for="attributeName">Отображаемое название</label>
                    </div>
                   
                    <div class="form-control">
                        <input type="text" name="attributeKey" id="attributeKey" required placeholder=" "/>
                        <label for="attributeKey">Ключ</label>
                    </div>
                    
                    <div class="form-control">
                        <select name="attributeType" id="attributeType" placeholder=" ">
                          <option value="string">Строка</option>
                          <option value="number">Число</option>
                          <option value="boolean">Логическое</option>
                          <option value="date">Дата</option>
                          <option value="bbcode">BBCode</option>
                          <option value="image">Изображение</option>
                          <option value="file">Файл</option>
                        </select>
                        <label for="attributeType">Тип</label>
                    </div>
                </div>
                <div class="attribute-form-row">
                    <div class="form-control">
                        <input id="requiredAttribute" name="requiredAttribute" type="checkbox" class="switch" placeholder=" ">
                        <label for="requiredAttribute">Обязательный</label>
                    </div>
                    <div class="form-control">
                        <input id="multipleAttribute" name="multipleAttribute" type="checkbox" class="switch" placeholder=" ">
                        <label for="multipleAttribute">Множественный</label>
                    </div>
                    <div class="form-control">
                        <input id="defaultValue" name="defaultValue" type="checkbox" class="switch" placeholder=" ">
                        <label for="defaultValue">Значение по умолчанию</label>
                    </div>
                </div>
            </form>
            <style>
                :host {
                    display: flex;
                    padding: 8px;
                    border: 1px solid var(--base-03);
                }
                
                .attribute-form-row{
                        display: flex;
                        box-sizing: border-box;
                        flex-direction: row;
                        flex-grow: 1;
                        column-gap: 16px;
                        margin-bottom: 16px;
                        justify-content: space-around;
                        align-items: center;
                        flex-wrap: nowrap;
                        align-content: center;
                        
                }
            </style>
        `
    }

    value(): Record<string, unknown> {
        return {};
    }
}