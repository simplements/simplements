export const AttributeDef: PluginDefinitionType = {
    selector: 'attribute-config',
    description: 'custom element for attribute configuration for blocks',
    component: () => import('./attribute-config').then((m)=>m.AttributeConfigComponent),
    plugin: ()=> Promise.resolve(null),
}