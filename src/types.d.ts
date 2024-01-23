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
}