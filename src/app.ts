import('../package.json').then(({version})=>{
    console.log('version', version);
})

import('./plugins').then(m=>{
    const plugins = Object.values(m);
    plugins.forEach((plugin)=>{

            plugin.component().then((cmp)=>{
                window.customElements.define(
                    plugin.selector,
                    cmp,
                )
            })

    })
    return plugins.map((plugin)=>Promise.all([Promise.resolve(plugin.pluginName),plugin.plugin()]))

}).then((plugins) => {
    return Promise.all([import('@editorjs/editorjs'), ...plugins]).then(([{default: EditorJS},...resolvedPlugins])=>{
        editor = new EditorJS({
            autofocus: true,
            tools: resolvedPlugins.reduce((acc: Record<string, PluginWidget>, [name, pluginWidget, ])=>{
                acc[name] = pluginWidget;
                return acc;
            }, {})
        })
    })
})






let editor: EditorJS.default;

const saveButton = document.getElementById('save');
const output = document.getElementById('output');

saveButton?.addEventListener('click', () => {
    editor.save().then( savedData => {
        if(output)
        output.innerHTML = JSON.stringify(savedData, null, 4);
    })
})