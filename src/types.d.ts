declare abstract class PluginWidget {
  static pluginName: string;
  static description: string;
}

declare type PluginDefinitionType = {
  pluginName?: string;
  selector: string;
  description: string;
  component: () => Promise<CustomElementConstructor>;
  plugin: () => Promise<PluginWidget | null>;
};

declare abstract class CustomElement {
  static selector: string;
  static extends: string | undefined;
  _shadowDom: ShadowRoot;
  [key: string]: unknown;
}

declare module '*.html';
declare module '*.css';
