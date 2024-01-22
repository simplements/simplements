export const PluginsRepository = import('./plugins').then(m=>{
    const plugins = Object.values(m);
    plugins.forEach((plugin)=>{
        plugin.component().then((cmp)=>{
            window.customElements.define(
                plugin.selector,
                cmp,
            )
        })
    })
    return plugins.map((plugin)=>Promise.all([Promise.resolve(plugin.pluginName),plugin.plugin()]));
})