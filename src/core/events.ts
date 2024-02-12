export interface ModelChangeEvent {
    value: string;
}

export const EVENTS ={
    'modelChange': (value: string)=>new CustomEvent<ModelChangeEvent>('model-change', {detail: {value: value}})
}