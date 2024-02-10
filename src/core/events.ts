export interface XEvent {
    value: string;
}

export const EVENTS ={
    'change': ()=>new CustomEvent<XEvent>('x-change')
}