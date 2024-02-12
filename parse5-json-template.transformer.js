import { parseFragment } from "parse5";

export function recursiveNodeIds(node, parentId='1', index= 0){
    const id = parentId+'.'+index;
    if(node.nodeName === "#text") {
        if(node.value.replace(/\s/ig, '') === ''){
            return null;
        }
    }
    return node.childNodes? {
        ...node,
        parentNode: null,
        nodeId: id,
        childNodes: node.childNodes.map((child, index)=>recursiveNodeIds(child, id, index)).filter((n)=>!!n),
    }: {
        ...node, nodeId: id, parentNode: null
    }
}

export function parse5JsonTemplateTransformer(html) {
    const parsed = parseFragment(html);
    const pure  = recursiveNodeIds(parsed.childNodes[0], '0', 0)
    return JSON.stringify(pure);
}