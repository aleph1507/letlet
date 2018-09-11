import { ValidatorFn, AbstractControl } from "@angular/forms";

export function lengthValidator(l: number) : ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if(control.value == null)
      return null;
    const len = control.value.toString();
    return len.length == l ? null : {'failed': {value: control.value}};
  }
}
