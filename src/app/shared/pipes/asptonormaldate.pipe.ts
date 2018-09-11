import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'asptonormaldate'})
export class AsptonormaldatePipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    if(!value) return value;

    let parts = (value.split("T")[0]).split('-');
    return parts[2] + '-' + parts[1] + '-' + parts[0];
  }

}
