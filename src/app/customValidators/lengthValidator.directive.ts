import { ValidatorFn, AbstractControl } from "@angular/forms";

export function lengthValidator(l: number) : ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    // console.log('control: ', control);
    if(control.value == null)
      return null;
    const len = control.value.toString();
    // console.log(`l: ${l}\nlen: ${len}\nlen.length: ${len.length}\ncontrol.value: ${control.value}`);
    return len.length == l ? null : {'failed': {value: control.value}};
  }
}
