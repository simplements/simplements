export class BlockWidget implements PluginWidget {
  static pluginName = 'block';
  static description = 'Block Plugin create a block with attributes';
  static get toolbox() {
    return {
      title: 'Block',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#1C274C" fill="none" stroke-width="1.5"/>
                        <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>`,
    };
  }
  private data: Record<string, unknown> = {};
  constructor({ data }: { data: Record<string, unknown> }) {
    this.data = data;
  }
  render() {
    const elem: import('./block-config.component').BlockConfigComponent = document.createElement(
      'block-config'
    ) as import('./block-config.component').BlockConfigComponent;
    elem.privateValue = JSON.stringify(this.data);
    console.log(this.data);
    return elem;
  }
  save(blockContent: HTMLInputElement) {
    console.log(blockContent);
    return {
      config: blockContent.value,
    };
  }
}
