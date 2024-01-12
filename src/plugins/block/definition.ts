export const PluginDefinition: PluginDefinitionType = {
    pluginName: 'block',
    selector: 'block-editor',
    description: 'plugin for define blocks and configure metadata',
    component: () => import('./block-config.component').then((m)=>m.BlockConfigComponent),
    plugin: () => import('./block').then((m) => m.BlockWidget)
}