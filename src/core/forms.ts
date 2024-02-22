import {Simplement} from "./simplement";
import {computed, effect, signal, WriteSignal} from "@maverick-js/signals";

export enum FormControlValidationState {
    INIT = 1,
    VALID = 2,
    INVALID = 3
}
export enum FormControlState {
    INIT = 1,
    TOUCHED = 2
}


export abstract class FormControl extends Simplement{
    abstract validation: WriteSignal<Array<()=>boolean>>;
    abstract valueParser(value: string): unknown;
    controlState = signal(FormControlState.INIT)
    validationState= signal(FormControlValidationState.INIT);
    value = signal("")
    parsedValue = computed(()=>{
        const value = this.value();
        return this.valueParser(value);
    })

    override init() {
        super.init();
        effect(() => {
            console.log(this.value())
            const val = this.value();
            console.log(JSON.stringify(this.validation()))
            // this.validation().forEach((validation)=>{
            //     validation();
            // })
            this.controlState.set(FormControlState.TOUCHED);
            this.validationState.set(FormControlValidationState.INVALID);
        })
    }
}

export type SimplementFormValidation = {};
export type SimplementFormValidator = (formModel: {[key:string]: string}, controlValue: string )=> SimplementFormValidation;