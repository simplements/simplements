export const PluginsRepository = import('./plugins').then((m) => {
  const plugins = Object.values(m);
  plugins.forEach((plugin) => {
    plugin.component().then((cmp) => {
      if (cmp && plugin.selector) {
        try {
          window.customElements.define(plugin.selector, cmp);
        } catch (e) {}
      }
    });
  });
  return plugins.map((plugin) => Promise.all([Promise.resolve(plugin.pluginName), plugin.plugin()]));
});
