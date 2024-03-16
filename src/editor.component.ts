const Editor = import('@editorjs/editorjs').then((m) => m.default);
const PluginsRepository = import('plugins.repository')
  .then((m) => m.PluginsRepository)
  .then(async (repo) => Promise.all(repo));
export class EditorComponent extends HTMLElement {
  private editor: import('@editorjs/editorjs').default | undefined;
  private uuid: string;
  private cbArray: ((value: Record<string, unknown>) => void)[] = [];
  constructor() {
    super();
    this.uuid = (Math.random() * 10000).toString(16).replace(/\./gi, '');
    this.innerHTML = `
<button id='save_button__uuid-${this.uuid}'>save</button>
<div id='${this.uuid}'></div>`;
  }
  connectedCallback() {
    const data = JSON.parse(localStorage.getItem('data') || '{}');
    Promise.all([Editor, this.getPlugins()])
      .then(([editor, plugins]) => {
        this.editor = new editor({
          autofocus: true,
          tools: plugins, // todo: append all plugins
          holderId: this.uuid,
          data: data,
        });
      })
      .then(() => {
        document
          .querySelector(`#save_button__uuid-${this.uuid}`)
          ?.addEventListener('click', async () => this.emitValue());
      });
  }
  async getPlugins() {
    return PluginsRepository.then((plugins) => {
      return plugins.reduce((acc: Record<string, PluginWidget>, [name, pluginWidget]) => {
        if (pluginWidget && name) {
          acc[name] = pluginWidget;
        }
        return acc;
      }, {});
    });
  }

  subscribeToValueChanges(cb: (e: Record<string, unknown>) => void) {
    this.cbArray.push(cb);
  }
  async emitValue() {
    const value = await (this.editor?.save() || Promise.resolve({}));
    localStorage.setItem('data', JSON.stringify(value));
    this.cbArray.forEach((cb) => {
      try {
        cb(value);
      } catch (e) {}
    });
  }
}
