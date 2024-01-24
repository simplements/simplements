import('../package.json').then(({version})=>{
    console.log('version', version);
})
console.log('a');
import('./form-controls').then(m=>Object.values(m)).then((cmp)=>{
    for(let elem of cmp){
        try {
            window.customElements.define(elem.selector, elem)
        }catch (e){

        }
    }
})
import('./editor.component')
    .then((m)=> m.EditorComponent)
    .then((cmp)=> window.customElements.define(
        'editor-js',
        cmp,
    ))
    .then(()=>{
        (document.querySelector('editor-js') as import('./editor.component').EditorComponent)
            .subscribeToValueChanges((e)=>console.log(e))
    })

